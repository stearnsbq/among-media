import { InferenceService } from './../inference.service';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-inference',
  templateUrl: './inference.component.html',
  styleUrls: ['./inference.component.scss']
})
export class InferenceComponent implements OnInit {
  @ViewChild("canvas") canvasRef : ElementRef
  @ViewChild("video") videoRef : ElementRef
  public model;
  public currentImg;
  public processing = false;


  public classesDir = {
    1: {
        name: 'Crewmate',
        id: 1,
    }
}

  constructor(private inferenceService : InferenceService){

    tf.setBackend('webgl')

  }


  async ngOnInit(){
    this.model = await tf.loadGraphModel("./assets/model/model.json")
    this.inferenceService.fileUploadSubject.subscribe((file) => {
      this.currentImg = file
      this.inference(file)
    })
  }


  async inference(file){
    const url = URL.createObjectURL(file), image = new Image();

    image.onload =  async () => {
      URL.revokeObjectURL(image.src)

      tf.engine().startScope()

      const ctx = this.canvasRef.nativeElement.getContext("2d")

      ctx.drawImage(image, 0, 0, 512, 512);

      const tfimg = tf.browser.fromPixels(image).toInt().transpose([0,1,2]).expandDims()

      this.processing = true

      this.model.executeAsync(tfimg).then((predictions) => {
        this.render(predictions)
        this.processing = false;
      })
      
      tf.engine().endScope()
    }

    image.src = url;

  }



  buildDetectedObjects(scores, threshold, boxes, classes, classesDir) {
    const detectionObjects = []
    var video_frame = this.canvasRef.nativeElement;


    scores[0].forEach((score, i) => {

      if (score > threshold) {



        const bbox = [];
        const minY = boxes[0][i][0] * video_frame.offsetHeight;
        const minX = boxes[0][i][1] * video_frame.offsetWidth;
        const maxY = boxes[0][i][2] * video_frame.offsetHeight;
        const maxX = boxes[0][i][3] * video_frame.offsetWidth;
        bbox[0] = minX;
        bbox[1] = minY;
        bbox[2] = maxX - minX;
        bbox[3] = maxY - minY;
        detectionObjects.push({
          class: classes[i],
          label: classesDir[1].name,
          score: score.toFixed(4),
          bbox: bbox
        })
      }
    })
    return detectionObjects
  }


  public render(predictions){
    const ctx = this.canvasRef.nativeElement.getContext("2d");
    //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";



    //Getting predictions
    const boxes = predictions[0].arraySync();
    const scores = predictions[3].arraySync();
    const classes = predictions[1].dataSync();
    const detections = this.buildDetectedObjects(scores, 0.6,
                                    boxes, classes, this.classesDir);

    detections.forEach(item => {
      const x = item['bbox'][0];
      const y = item['bbox'][1];
      const width = item['bbox'][2];
      const height = item['bbox'][3];

      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(item["label"] + " " + (100 * item["score"]).toFixed(2) + "%").width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    detections.forEach(item => {
      const x = item['bbox'][0];
      const y = item['bbox'][1];

      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(item["label"] + " " + (100*item["score"]).toFixed(2) + "%", x, y);
    });
  }

}
