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

    <any-component  [is]="wrapper" [props]="wrapperProps">
      <any-content>
      This content is inside an &lt;any-component/&gt; which creates another
      component with dynamic poperties

      <button type="button" (click)="increaseWidth()">
        Click to increase the border width ({{ wrapperProps.width }}px)
      </button>

      <border-component [width]="wrapperProps.width">
        Content inside a regular border-component which is projected in the any-component
      </border-component>

      </any-content>
    </any-component>

    <br>

    <button type="button" (click)="changeType()">
      Click to switch container type
    </button>

    <br>
  </div>
  `,
  styles: [`border-component { padding: 10px; margin: 10px; }`]
})
export class AppComponent {
  wrapper: Type<any> = BorderComponent;
  wrapperProps = {
    width: 10,
    color: 'green',
  };

  increaseWidth() {
    this.wrapperProps.width += 10;
    console.log(`props: ${JSON.stringify(this.wrapperProps)}`);
  }

  changeType() {
    if (this.wrapper === BorderComponent) {
      this.wrapper = BackgroundComponent;
    }
    else {
      this.wrapper = BorderComponent;
    }
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
