import { Component } from '@angular/core';
import { UploadingService } from  '../services/uploading.service';
import { FileUploader, FileLikeObject } from  'ng2-file-upload';
import { concat } from  'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public fileUploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;

  constructor(private uploadingService: UploadingService) {}

  fileOverBase(event): void {
    this.hasBaseDropZoneOver = event;
  }
  getFiles(): FileLikeObject[] {
    return this.fileUploader.queue.map((fileItem) => {
      return fileItem.file;

    });
  }
  uploadFiles() {

    let files = this.getFiles();
    let requests = [];

    files.forEach((file) => {
      let formData = new FormData();
      formData.append('file' , file.rawFile, file.name);
      requests.push(this.uploadingService.uploadFormData(formData));

    });

    concat(...requests).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {  
        console.log(err);
      }
    );
  }

}
