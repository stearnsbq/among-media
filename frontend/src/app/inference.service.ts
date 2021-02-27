import { Injectable } from '@angular/core';
import { Sub } from '@tensorflow/tfjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InferenceService {
  private _fileUploadSubject: Subject<any>

  constructor() {
    this._fileUploadSubject = new Subject()
  }


  get fileUploadSubject(): Subject<any>{
    return this._fileUploadSubject
  }


}
