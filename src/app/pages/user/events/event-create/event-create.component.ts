import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { CreateEventPresenter } from '../../../../interfaces/presenter/event/create_event.presenter';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  eventForm: FormGroup;
  event: CreateEventPresenter;
  mapbox = (mapboxgl as typeof mapboxgl); 
  map: any; 
  mapToken: string = environment.MAP_BOX_TOKEN;
  markers: mapboxgl.Marker[]=[];

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initMap();
  }

  public initForm(): void {
    this.eventForm = this.formBuilder.group({
      name  : ['', [ Validators.required ]  ],
      description: ['', [Validators.required ] ],
      lat  : ['', [] ],
      long : ['', [] ],
      date: [new Date(), [ Validators.required ] ]
    });
  }

  public initMap(): void {
    this.mapbox.accessToken = this.mapToken; 
    this.map =  new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', 
      center: [-74.049310,4.719460], 
      zoom: 9
    });
    this.map.on('load', (e:any) => {
      this.map.resize();
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.createMarker([-74.049310,4.719460]);
    this.map.on('click', (e:any) => {
      this.createMarker(e.lngLat); 
    });
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

  onSubmit($event: Event) {
    if (this.eventForm.valid) {
      this.event = {
        name: this.eventForm.get('name').value,
        description: this.eventForm.get('description').value,
        lat: this.markers[0].getLngLat().lat,
        long: this.markers[0].getLngLat().lng,
        date: this.eventForm.get('date').value
      };
      const eventResponse = this.eventService.createEvent(this.event);
      eventResponse.subscribe((resp:any) => console.log(resp));
      this.router.navigate(['./main/feed']);
      return true;
    } else {
      $event.preventDefault();
      return false;
    }
  }

  invalidInput(input: string): boolean {
    return this.eventForm.get(input).invalid && this.eventForm.get(input).touched;
  }

}
