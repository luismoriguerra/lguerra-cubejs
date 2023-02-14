import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CubejsClientModule } from '@cubejs-client/ngx';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { QueryRendererComponent } from './components/charttable/charttable.component';
import { NgChartsModule } from 'ng2-charts';

const cubejsOptions = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzYzMzkwMzUsImV4cCI6MTY3NjQyNTQzNX0.32DLogt0AsFPaf5XaiUE1AYfBU7T4KfzFTkSrkitkKc',
  options: {
    apiUrl: 'http://localhost:4000/cubejs-api/v1',
  },
};

@NgModule({
  declarations: [AppComponent, QueryRendererComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CubejsClientModule.forRoot(cubejsOptions as any),
    NgChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
