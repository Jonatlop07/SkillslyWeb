import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import * as mapboxgl from 'mapbox-gl';
import { EventModel } from 'src/app/models/events.model';
import { EventService } from 'src/app/services/event.service';
import { environment } from 'src/environments/environment';

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


  public user_name = 'nombre de usuario';
  public display = false;

  constructor(
    private eventService: EventService,
    private store: Store,
    private router: Router
  ) { }

  ngOnInit(): void {
    
  }
  
  ngAfterViewInit(): void {
    this.initMap();
  }

  deleteEvent(event_id: string) {
    // const deletePostInterface: DeletePostInterface = {
    //   post_id,
    // }
    // this.postService
    //   .deletePost(deletePostInterface)
    //   .subscribe(() => {
    //     this.store.dispatch(new DeleteMyPost(post_id));
    //   });
  }

  updateEvent(event_id: string) {
    // this.router.navigate(['main/post/update', post_id]);
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

}
