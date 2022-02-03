import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import * as mapboxgl from 'mapbox-gl';
import { EventModel } from 'src/app/models/event_collection.model';
import { EventService } from 'src/app/services/event.service';
import { DeleteMyEvent } from 'src/app/shared/state/events/events.actions';
import { environment } from 'src/environments/environment';
import { JwtService } from '../../../services/jwt.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, AfterViewInit {

  @Input() event: EventModel;
  @Input() editable: boolean;
  @Input() map_id: number;

  public mapbox = (mapboxgl as typeof mapboxgl);
  public map: any;
  public mapToken: string = environment.MAP_BOX_TOKEN;
  public markers: mapboxgl.Marker[]=[];
  public assistance: boolean;
  public day: string;
  public month: string;
  public year: string;
  public hour: string;
  public mdate: string;
  public user_name = 'nombre de usuario';
  public display = false;

  constructor(
    private eventService: EventService,
    private jwtService:JwtService,
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDate(this.event.date);
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

  public deleteEvent(event_id: string): void {
    const eventServiceResponse = this.eventService.deleteEvent(event_id);
    eventServiceResponse.subscribe(() => {
      this.store.dispatch(new DeleteMyEvent(event_id)).subscribe(() => {
        Swal.fire('Evento eliminado con éxito','','success').then( function () {
          location.reload();
        });
      });
    });
  }

  public updateEvent(event_id: string): void {
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

  public createMarker(e:any): void {
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

  public createAssistance(event_id: string): void {
    const eventServiceResponse = this.eventService.createAssistance({event_id, user_id: this.jwtService.getUserId()});
    eventServiceResponse.subscribe((resp:any) => {
      this.assistance = true;
      this.eventService.getAndStoreMyAssistancesCollection();
    });
  }

  public deleteAssistance(event_id:string): void {
    const eventServiceResponse = this.eventService.deleteAssistance({event_id, user_id: this.jwtService.getUserId()});
    eventServiceResponse.subscribe(() => {
      this.assistance = false;
      this.eventService.getAndStoreMyAssistancesCollection();
    });
  }

  public getDate(date: Date): void {
    moment.locale('es');
    let momentDate = moment(date).format("MMM DD YYYY, h:mm a");
    this.month = momentDate.slice(0,3);
    this.day = momentDate.slice(4,7);
    this.year = momentDate.slice(7,12);
    this.hour = momentDate.slice(13,21);
  }

}
