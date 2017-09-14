import {
  Component,
  Input,
  NgModule,
  Type,
  ViewChild,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnyComponent } from './any.component';
import { AnyContentDirective } from './any-content.directive';
import { AnyComponentModule } from './module';

describe('AnyComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let instance: TestHostComponent;
  let element: HTMLElement;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
      ],
      declarations: [
        AnyComponent,
        AnyContentDirective,
        TestHostComponent,
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    instance = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('content is projected without a target component', () => {
    instance.is = null;
    fixture.detectChanges();
    const content = element.textContent;

    expect(content).toContain('One.');
    expect(content).toContain('Two.');
    expect(content).toContain('Three.');

    instance.is = OneSlotComponent;
    fixture.detectChanges();

    expect(element.textContent.trim()).toBe('One.');
  });

  it('content is projected to target component', () => {
    // only one <any-content> is projected to a one-slot component
    instance.is = OneSlotComponent;
    fixture.detectChanges();

    expect(element.textContent.trim()).toBe('One.');

    // three <any-content>s are projected to a three-slot component
    instance.is = ThreeSlotComponent;
    fixture.detectChanges();

    const threeContent = element.textContent;
    expect(threeContent).toContain('One.');
    expect(threeContent).toContain('Two.');
    expect(threeContent).toContain('Three.');
  });

  it('<any-content> elements are not rendered in the DOM', () => {
    instance.is = null;
    fixture.detectChanges();

    expect(element.querySelector('any-content')).toBe(null);

    instance.is = ThreeSlotComponent;
    fixture.detectChanges();

    expect(element.querySelector('any-content')).toBe(null);
  });

  it('props are passed on target component creation', () => {
    const prop1 = 'TEST_VALUE_1';
    const prop2 = 'TEST_VALUE_2';

    instance.props = { prop1, prop2 };
    fixture.detectChanges();

    instance.is = TestPropsComponent;
    fixture.detectChanges();

    expect(element.textContent.trim()).toBe(`${prop1}, ${prop2}`);
  });

  it('props are updated on change', () => {
    const prop1 = 'TEST_VALUE_1';
    const prop2 = 'TEST_VALUE_2';

    instance.is = TestPropsComponent;
    fixture.detectChanges();

    expect(element.textContent.trim()).toBe(`,`);

    instance.props = { prop1, prop2 };
    fixture.detectChanges();

    expect(element.textContent.trim()).toBe(`${prop1}, ${prop2}`);

    instance.props = { prop1 };
    fixture.detectChanges();

    expect(element.textContent.trim()).toBe(`${prop1},`);

    element.querySelector('button').click();
    fixture.detectChanges();

    expect(element.textContent.trim()).toBe(`,`);
  });

  it('ngOnChanges of target component is called on prop change', () => {
    instance.is = TestPropsComponent;
    instance.props = {};
    fixture.detectChanges();

    const targetInstance = instance.anyComponent.component.instance;

    expect(targetInstance.changes.length).toBe(0);

    const prop1 = 'TEST_VALUE_1';
    const prop2 = 'TEST_VALUE_2';

    instance.props = { prop1, prop2 };
    fixture.detectChanges();

    expect(targetInstance.changes.length).toBe(2);
    expect(targetInstance.changes[0].prop1.previousValue).toBe(undefined);
    expect(targetInstance.changes[0].prop1.currentValue).toBe(prop1);
    expect(targetInstance.changes[1].prop2.previousValue).toBe(undefined);
    expect(targetInstance.changes[1].prop2.currentValue).toBe(prop2);

    fixture.detectChanges();
  });
});

@Component({
  template: `
    <any-component [is]="is" [props]="props">
      <any-content>One.</any-content>

      <any-content> <div>Two.</div> </any-content>

      <any-content> <span>Thr</span><span>ee.</span> </any-content>
    </any-component>
  `,
})
class TestHostComponent {
  @ViewChild(AnyComponent) anyComponent: AnyComponent;

  is: Type<any>;
  props: any;
}

@Component({
  template: `
      <ng-content></ng-content>
  `,
})
class OneSlotComponent {}

@Component({
  template: `
      <ng-content></ng-content>
      <ng-content></ng-content>
      <ng-content></ng-content>
  `,
})
class ThreeSlotComponent {}

@Component({
  template: `<button (click)="clearProps()">{{ prop1 }}, {{ prop2 }}</button>`,
})
class TestPropsComponent {
  @Input() prop1;
  @Input() prop2;

  changes = [];

  ngOnChanges(changes) {
    this.changes.push(changes);
  }

  clearProps() {
    this.prop1 = null;
    this.prop2 = null;
  }
}

const targetComponents = [
  OneSlotComponent,
  ThreeSlotComponent,
  TestPropsComponent,
];

@NgModule({
  declarations: targetComponents,
  exports: targetComponents,
  entryComponents: targetComponents,
})
export class TestModule { }
