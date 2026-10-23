import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { DataService } from '../../services/data.service';
import { Kpi } from '../../models/kpi';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public pieChart!: Chart<"pie", number[], string>;
  public totalCountries = 0
  public totalJOs = 0
  public error!:string
  titlePage = "Medals per Country";
  public kpis: Kpi[] = [];
  public loading = true;



  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getOlympics().subscribe(
      (data) => {
        this.loading = false;
        if (data && data.length > 0) {
          this.totalJOs = new Set(
            data
              .map(olympicCountry => olympicCountry.participations.map(participation => participation.year))
              .flat()
          ).size;
          const countries = data.map(olympicCountry => olympicCountry.country);
          const countryIds = data.map(country => country.id);
          this.totalCountries = countries.length;
          const medals = data.map(olympicCountry => olympicCountry.participations.map(participation => participation.medalsCount));
          const sumOfAllMedalsYears = medals.map(countryMedals => countryMedals.reduce((total, medalCount) => total + medalCount, 0));
          this.buildPieChart(countries, sumOfAllMedalsYears, countryIds);
          this.kpis = [
            { label: 'Number of countries', value: this.totalCountries.toString() },
            { label: 'Number of JOs', value: this.totalJOs.toString() }
          ];
        }else {
          this.error = 'Aucune donnée n\'est disponible';
        }
      },
      (error:HttpErrorResponse) => {
        this.loading = false;
        this.error = error.message
      }
    )
  }

  buildPieChart(countries: string[], sumOfAllMedalsYears: number[], countryIds: number[]) {
    const pieChart = new Chart("DashboardPieChart", {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [{
          label: 'Medals',
          data: sumOfAllMedalsYears,
          backgroundColor: ['#0b868f', '#adc3de', '#7a3c53', '#8f6263', 'orange', '#94819d'],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(e.native, 'point', { intersect: true }, true)
            if (points.length) {
              const firstPoint = points[0];
              // const countryName = pieChart.data.labels ? pieChart.data.labels[firstPoint.index] : '';
              const countryId = countryIds[firstPoint.index];
              this.router.navigate(['/country', countryId]);
            }
          }
        }
      }
    });
    this.pieChart = pieChart;
  }
}

