import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  SimpleChange,
  ViewChild,
  ContentChildren,
  ElementRef,
  ViewContainerRef,
  Renderer,
  Type,
} from '@angular/core';

import { AnyContentDirective } from './any-content.directive';

@Component({
  selector: 'any-component',
  template: `
    <ng-template #template>
      <ng-content></ng-content>
    </ng-template>
    <ng-container #container></ng-container>
  `,
  styles: []
})
export class AnyComponent {
  @Input() is: Type<any>;
  @Input() props: any = null;

  @ViewChild('template', {read: ViewContainerRef}) templateViewContainer: ViewContainerRef;
  @ViewChild('container', {read: ElementRef}) containerRef: ElementRef;
  @ContentChildren(AnyContentDirective, {read: ElementRef}) content;

  factory: ComponentFactory<any> = null;
  component: ComponentRef<any> = null;

  private propVals: any = {};
  private changedProps: { [index:string]: boolean } = {};
  private projectedNodes: any[][];

  constructor(
    private resolver: ComponentFactoryResolver,
    private viewContainer: ViewContainerRef,
  ) {
  }

  ngAfterContentInit() {
    this.projectedNodes = this.projectedNodes || this.content
      .filter(ref => ref != this.viewContainer.element)
      .map(ref => Array.from(ref.nativeElement.childNodes))

    this.createComponent();
  }

  ngOnChanges(changes) {
    if (changes.props) {
      this.unsetProps(changes.props.previousValue);

      if (this.component) {
        this.setUpProps(changes.props.currentValue);
      }
    }

    if (changes.is) {
      this.createComponent();
    }
  }

  createComponent() {
    this.destroyComponent();

    if (!this.is || !this.content) {
      if (this.content) {
        // comment element representing the <ng-container/>
        const containerNode = this.containerRef.nativeElement;
        let nextSibling = containerNode.nextSibling;

        this.projectedNodes.forEach(nodeList => nodeList.forEach(node => {
          containerNode.parentNode.insertBefore(node, nextSibling);
          nextSibling = node.nextSibling;;
        }));
      }
      return;
    }

    this.projectedNodes.forEach(nodeList => nodeList.forEach(node => node.remove()));

    this.factory = this.resolver.resolveComponentFactory(this.is);
    this.component = this.templateViewContainer.createComponent(
      this.factory,
      undefined,
      undefined,
      this.projectedNodes,
    );

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
