import { InferenceService } from './../inference.service';
import { Component, OnInit, Output } from '@angular/core';
import * as EventEmitter from 'events';

@Component({
  selector: 'app-image-chooser',
  templateUrl: './image-chooser.component.html',
  styleUrls: ['./image-chooser.component.scss']
})
export class ImageChooserComponent implements OnInit {
  public image: any;

  constructor(private inference : InferenceService) { }

  ngOnInit(): void {
  }


  onUpload(file){
    this.inference.fileUploadSubject.next(file)
    this.image = file
  }

}
