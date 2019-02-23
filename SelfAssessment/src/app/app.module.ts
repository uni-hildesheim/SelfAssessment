import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { ResourceService } from './core/services/resource.service';


export function resourceProviderFactory(provider: ResourceService) {
  return () => provider.loadResources();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule
  ],
  providers: [
    ResourceService,
    {
      provide: APP_INITIALIZER,
      useFactory: resourceProviderFactory,
      deps: [ResourceService], multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
