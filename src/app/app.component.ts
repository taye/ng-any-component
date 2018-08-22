import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  SimpleChange,
  ViewChild,
  ViewContainerRef,
  Type,
} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div>
    <h3>
      Bellow is an &lt;any-component/&gt; with dynamic projected content
    </h3>

    <button type="button" (click)="changeType()">
      Click to switch container type ({{ wrappers[wrapperIndex] ? wrappers[wrapperIndex].name : 'none' }})
    </button>

    <any-component [is]="wrappers[wrapperIndex]" [props]="wrapperProps">
      <any-content>
      This content is inside an &lt;any-component/&gt; which creates another
      component with dynamic poperties

      Border width is currently set to {{ wrapperProps.width }}. Change it to: <br/>

      <button *ngFor="let width of [10, 20, 30]" (click)="setWidth(width)" type="button">
        {{ width }}px
      </button>

      <border-component [width]="wrapperProps.width">
        Content inside a regular border-component which is projected in the any-component
      </border-component>

      </any-content>
    </any-component>

    <br>

    <br>
  </div>
  `,
  styles: [`border-component { padding: 10px; margin: 10px; }`]
})
export class AppComponent {
  wrappers: Type<any>[] = [BorderComponent, BackgroundComponent, null];
  wrapperIndex = 0;
  wrapperProps = {
    width: 10,
    color: 'green',
  };

  setWidth(width) {
    this.wrapperProps.width = parseInt(width);
    console.log(`props: ${JSON.stringify(this.wrapperProps)}`);
  }

  changeType() {
    this.wrapperIndex = (this.wrapperIndex + 1) % this.wrappers.length;
  }
}

@Component({
  selector: 'border-component',
  template: `
    <div [ngStyle]="{ border: 'solid ' + width + 'px' + (color || '') }">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class BorderComponent {
  @Input() width = 1;

  ngOnChanges(changes) {
    console.log('border change', this.width);
  }
}

@Component({
  selector: 'bacground-component',
  template: `
    <div style="padding: 10px" [ngStyle]="{ backgroundColor: (color || '') }">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class BackgroundComponent {
  @Input() color = '#29e';
}
