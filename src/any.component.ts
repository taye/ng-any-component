import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  SimpleChange,
  ViewChild,
  ContentChildren,
  ViewContainerRef,
} from '@angular/core';

import { AnyContentDirective } from './any-content.directive';

@Component({
  selector: 'any-component',
  template: `
    <ng-template #template>
      <ng-content></ng-content>
    </ng-template>
  `,
  styles: []
})
export class AnyComponent {
  @Input() is: Function = null;
  @Input() props: any = null;

  @ViewChild('template', {read: ViewContainerRef}) templateViewContainer: ViewContainerRef;
  @ContentChildren(AnyContentDirective) content;

  factory: ComponentFactory<any> = null;
  component: ComponentRef<any> = null;

  private propVals: any = {};
  private changedProps: { [index:string]: boolean } = {};

  constructor(private resolver: ComponentFactoryResolver) {}

  ngAfterContentInit() {
    console.log('contents:', this.content && this.content._results);

    this.content.changes.subscribe(changes => {
      console.log('content changes:', changes);
    });
  }

  ngOnChanges(changes) {
    if (changes.props) {
      this.unsetProps(changes.props.previousValue);

      if (this.component) {
        this.setUpProps(changes.props.currentValue);
      }
    }

    if (changes.is) {
      this.destroyComponent();
      this.createComponent();
    }
  }

  createComponent() {
    if (!this.is) {
      return;
    }

    this.factory = this.resolver.resolveComponentFactory(this.is as any);
    this.component = this.templateViewContainer.createComponent(this.factory);

    // for (prop

    this.changedProps = {};

    this.unsetProps(this.props);
    this.setUpProps(this.props);

    for (const prop in this.props) {
      // this.component.instance[prop] = this.props[prop];
		  // this.component.changeDetectorRef.detectChanges();
    }
  }

  destroyComponent() {
    this.templateViewContainer.clear();
    this.component = null;
  }

  changeInstanceProp(prop, newValue) {
    if (!this.component) {
      return;
    }

    const instance = this.component.instance;
    const oldValue = instance[prop];

    if (oldValue === newValue) {
      return;
    }

    instance[prop] = newValue;
    this.changedProps[prop] = true;

    if (instance.ngOnChanges) {
      instance.ngOnChanges({
        [prop]: new SimpleChange(oldValue, newValue, !!this.changedProps[prop]),
      });
    }
  }

  setUpProps(props: any) {
    if (!props) {
      return;
    }

    Object.defineProperties(props, Object.keys(props).reduce((defs: any, prop) => {
      defs[prop] = {
        set: (newValue) => {
          this.propVals[prop] = newValue;
          this.changeInstanceProp(prop, newValue);
        },
        get: () => this.propVals[prop],

        enumerable: true,
        configurable: true,
      };

      const initialValue = props[prop];

      this.propVals[prop] = initialValue;
      // this.changeInstanceProp(prop, initialValue);

      return defs;
    }, {}));
  }

  unsetProps(oldProps: any) {
    if (!oldProps) {
      return;
    }

    Object.defineProperties(oldProps, Object.keys(oldProps).reduce((defs: any, prop) => {
      defs[prop] = {
        value: oldProps[prop],
        enumerable: true,
        configurable: true,
        writable: true,
      };

      return defs;
    }, {}));
  }
}
