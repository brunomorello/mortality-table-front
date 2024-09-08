import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MortalityPage } from './model/mortalityPage';
import { MortalityService } from './mortality.service';
import { Mortality } from './model/mortality';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mortality',
  templateUrl: './mortality.component.html',
  styleUrls: ['./mortality.component.css'],
})
export class MortalityComponent implements AfterViewInit, OnInit {

  form!: FormGroup;
  COLUMN_SCHEMA = [
    {
      'key': 'country',
      'type': 'text',
      'label': 'Country'
    },
    {
      'key': 'year',
      'type': 'text',
      'label': 'Year'
    },
    {
      'key': 'femaleTx',
      'type': 'text',
      'label': 'Female Tx'
    },
    {
      'key': 'maleTx',
      'type': 'text',
      'label': 'Male Tx'
    },
    {
      'key': 'edit',
      'type': 'edit',
      'label': ''
    }
  ];
  listMortality: Array<Mortality> = [];
  listYears: Array<number> = [];
  dataSource = new MatTableDataSource<Mortality>();
  displayedColumns: string[] = this.COLUMN_SCHEMA.map((col) => col.key);
  columnsSchema = this.COLUMN_SCHEMA;

  constructor(private service: MortalityService
  ) {
    this.form = new FormGroup({
      mortalities: new FormControl()
    })
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.service.getAll()
    .subscribe({
      next: (value: MortalityPage) => {
        this.listMortality = value.content;
        this.listYears = [...new Set(this.listMortality.map(mortality => mortality.year))];
        this.dataSource = new MatTableDataSource<Mortality>(this.listMortality);
      },
      error: (err) => console.error(err)
    });
  }
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editRecord(element: any) {
    const mortality: Mortality = {
      id: element['id'],
      country: element['country'],
      year: element['year'],
      femaleTx: element['femaleTx'],
      maleTx: element['maleTx'],
    };

    this.service.update(mortality).subscribe({
      next: () => element.edit = !element.edit,
      error: (err) => {
        if (err.error instanceof Array) {
          const allErrors = err.error.map((item: any) => item.msg)
          alert(allErrors);
        } else {
          alert(err.error.msg);
        }
        console.log(err);
      }
    });
  }

  onUserChange(element: any) {
    if (element.value === 'all') {
      this.fetchData();
    } else {
      this.service.getAllByYear(element.value).subscribe({
        next: (value: MortalityPage) => {
          this.listMortality = value.content;
          this.dataSource = new MatTableDataSource<Mortality>(this.listMortality);
        },
        error: (err) => console.error(err)
      });
    }
  }
}