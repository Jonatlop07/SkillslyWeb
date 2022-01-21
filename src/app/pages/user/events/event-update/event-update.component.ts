import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { EventModel } from 'src/app/models/events.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { CreateEventPresenter } from '../../../../interfaces/presenter/event/create_event.presenter';

@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.css']
})
export class EventUpdateComponent implements OnInit, AfterViewInit {

  public event_id: string;
  public event : EventModel;
  public updateEvent : CreateEventPresenter;
  public eventForm: FormGroup;
  public mapbox = (mapboxgl as typeof mapboxgl); 
  public map: any; 
  public mapToken: string = environment.MAP_BOX_TOKEN;
  public markers: mapboxgl.Marker[]=[];
  @ViewChild('mapElement') mapElement: ElementRef;

  constructor( 
    private formBuilder: FormBuilder,
    private activated_route: ActivatedRoute,
    private event_service: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activated_route.params.subscribe(params => {
      this.event_id = params.event_id;
      const eventServiceResponse = this.event_service.getMyEventsCollection()
      eventServiceResponse.subscribe((resp : any) => {
        resp.events.forEach( (element : any) => {
          if (this.event_id == element.event_id) {
            this.event = element; 
          }
        });
        this.initForm(this.event);
        setTimeout(() => {
          this.initMap();
        }, 100); 
      });
    });
  }

  public initForm(event : EventModel): void {
    this.eventForm = this.formBuilder.group({
      name  : [event.name, [ Validators.required ]  ],
      description: [event.description, [ Validators.required ] ],
      lat  : [event.lat, [] ],
      long : [event.long, [] ],
      date: [new Date(event.date), [ Validators.required ] ]
    });
  }

  ngAfterViewInit(): void {
  }

  public initMap(): void {
    this.mapbox.accessToken = this.mapToken; 
    this.map =  new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', 
      center: [this.event.long,this.event.lat], 
      zoom: 9
    });
    this.map.on('load', (e:any) => {
      this.map.resize();
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    this.createMarker([this.event.long,this.event.lat]);
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
      this.updateEvent = {
        name: this.eventForm.get('name').value,
        description: this.eventForm.get('description').value,
        lat: this.markers[0].getLngLat().lat,
        long: this.markers[0].getLngLat().lng,
        date: this.eventForm.get('date').value
      };
      const eventResponse = this.event_service.updateEvent(this.updateEvent, this.event_id);
      eventResponse.subscribe((resp:any) => this.event_service.getAndStoreMyEventsCollection());
      this.router.navigate(['./main/my-events']);
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
