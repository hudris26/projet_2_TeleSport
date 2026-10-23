import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  title = 'Page introuvable';
  message = 'Cette adresse ne correspond à aucune page.';

  constructor(route: ActivatedRoute) {
    const isMissingCountry =
      route.snapshot.queryParamMap.get('type') === 'country';
    const countryId = route.snapshot.queryParamMap.get('id');

    if (isMissingCountry && countryId !== null) {
      this.title = 'Pays introuvable';
      this.message = `Aucun pays ne correspond à l’identifiant ${countryId}.`;
    }
  }
}
