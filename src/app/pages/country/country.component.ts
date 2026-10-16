import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import Chart from 'chart.js/auto';
import { DataService } from '../../services/data.service';
import { Kpi } from '../../models/kpi';



@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  public lineChart!: Chart<"line", number[], number>;
  public titlePage= '';
  public totalParticipations = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error!: string;
  public kpis: Kpi[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private dataService: DataService) {
  }

  ngOnInit() {
    let countryName: string | null = null
    this.route.paramMap.subscribe((param: ParamMap) => countryName = param.get('countryName'));
    this.dataService.getOlympics().subscribe(
      (data) => {
        if (data && data.length > 0) {
          const selectedCountry = data.find((olympicCountry) => olympicCountry.country === countryName);
              if (!selectedCountry) {
                return;
              }
          this.titlePage = selectedCountry.country;
          const participations = selectedCountry.participations;
          this.totalParticipations = participations.length;
          const years = selectedCountry.participations.map(i => i.year) ?? [];
          const medalCountsPerParticipation = selectedCountry.participations.map(
            participation => participation.medalsCount
          );
          this.totalMedals = medalCountsPerParticipation.reduce((accumulator, item) => accumulator + item, 0);
          const nbAthletes = selectedCountry.participations.map((i) => i.athleteCount ?? 0);
          this.totalAthletes = nbAthletes.reduce((accumulator, item) => accumulator + item, 0);
          this.buildChart(years, medalCountsPerParticipation);
          this.kpis = [
            { label: 'Number of participations', value: this.totalParticipations.toString() },
            { label: 'Total Number of medals', value: this.totalMedals.toString() },
            { label: 'Total Number of athletes', value: this.totalAthletes.toString() }
          ];
        }
      },
      (error: HttpErrorResponse) => {
        this.error = error.message
      }
    );
  }

  buildChart(years: number[], medals: number[]) {
    const lineChart = new Chart("countryChart", {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: "medals",
            data: medals,
            backgroundColor: '#0b868f'
          },
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
    this.lineChart = lineChart;
  }
}
