import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import * as mapboxgl from 'mapbox-gl';
import { EventModel } from 'src/app/models/events.model';
import { EventService } from 'src/app/services/event.service';
import { DeleteMyEvent } from 'src/app/shared/state/events/events.actions';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../../../services/jwt.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, AfterViewInit {

  @Input() event: EventModel;
  @Input() editable: boolean; 
  @Input() map_id: number;
  mapbox = (mapboxgl as typeof mapboxgl); 
  map: any; 
  mapToken: string = environment.MAP_BOX_TOKEN;
  markers: mapboxgl.Marker[]=[];
  assistance: boolean; 


  public user_name = 'nombre de usuario';
  public display = false;

  constructor(
    private eventService: EventService,
    private  jwtService:JwtService,
    private store: Store,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.assistance = false; 
    this.eventService.getMyAssistances().forEach( (event:EventModel) => {
      if (this.event.event_id == event.event_id) {
        this.assistance = true; 
      }
    });
  }
  
  ngAfterViewInit(): void {
    this.initMap();
  }

  deleteEvent(event_id: string) {
    const eventServiceResponse = this.eventService.deleteEvent(event_id);
    eventServiceResponse.subscribe(() => {
      this.store.dispatch(new DeleteMyEvent(event_id));
    });
  }

  updateEvent(event_id: string) {
    this.router.navigate(['main/events/update', event_id]);
  }

  public initMap(): void {
    this.mapbox.accessToken = this.mapToken; 
    this.map =  new mapboxgl.Map({
      container: `map${this.map_id}`,
      style: 'mapbox://styles/mapbox/streets-v11', 
      center: [this.event.long,this.event.lat], 
      zoom: 10
    });
    this.map.on('load', (e:any) => {
      this.map.resize();
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.createMarker([this.event.long,this.event.lat]);
  }

  createMarker(e:any){ 
    if (this.markers !== null) {
      for (let i = 0; i<this.markers.length; i++) {  
        let aux = new mapboxgl.Marker(); 
        aux = this.markers[i];  
        aux.remove(); 
        this.markers.splice(i,1); 
      }
    }
    const marcador = new mapboxgl.Marker().setLngLat(e).addTo(this.map);
    this.markers.push(marcador); 
  }

  createAssistance(event_id: string) {
    const eventServiceResponse = this.eventService.createAssistance({event_id, user_id: this.jwtService.getUserId()});
    eventServiceResponse.subscribe((resp:any) => {
      console.log(resp)
      this.assistance = true;
      this.eventService.getAndStoreMyAssistancesCollection();
    });
  }

  deleteAssistance(event_id:string) {
    const eventServiceResponse = this.eventService.deleteAssistance({event_id, user_id: this.jwtService.getUserId()});
    eventServiceResponse.subscribe(() => {
      this.assistance = false;
      this.eventService.getAndStoreMyAssistancesCollection();
    });
  }

}
