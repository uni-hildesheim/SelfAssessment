import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';


export interface User {
  pin: number;
  created: string;
  journal: any;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  displayedColumns: string[] = ['test', 'pin', 'created', 'journal'];
  dataSource = new MatTableDataSource<User>();

  selectAllModel = false;
  elementModel = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.http.post('api/v1/admin/user/find', {
      'secret': 'root',
      'query': {}
    }).subscribe((data: User[]) => {
      this.dataSource.data = data;
      this.elementModel = data.map(user => {
        const pin = user.pin;
        const obj = {
          pin: false
        };
        return obj;
      });
    });
  }

  selectAll() {
    const start = this.paginator.pageSize * this.paginator.pageIndex;
    let count = start;

    while (count < (start + this.paginator.pageSize) && count < this.paginator.length ) {
      this.elementModel[this.dataSource.data[count].pin] = this.selectAllModel;
      count++;
    }

  }

  changePage($event){
    this.selectAllModel = false;
    this.elementModel = this.dataSource.data.map(user => {
      const pin = user.pin;
      const obj = {
        pin: false
      };
      return obj;
    });
  }




}
