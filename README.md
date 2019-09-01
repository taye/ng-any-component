# ng2-any-component

A pair of directives for creating other components dynamically with projected
content and changing inputs.

[![Maintainability](https://api.codeclimate.com/v1/badges/f8d60c47db39fe38cbc9/maintainability)](https://codeclimate.com/github/taye/ng-any-component/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f8d60c47db39fe38cbc9/test_coverage)](https://codeclimate.com/github/taye/ng-any-component/test_coverage)

```html
<!-- parent.component.html -->
<any-component
  [is]="SomeComponent"
  [props]="objectOfInputs">

  <any-content>
    The HTMLNodes within this `<any-content>` tag will be projected into an
    instance of `SomeComponent`
  </any-content>
</any-component>
```

```typescript
// parent.component.ts
import { SomeComponent } from './some.component.ts';

@Component({
  selector: 'app-root',
  templateUrl: './parent.component.html',
})
class ParentComponent {
  SomeComponent = SomeComponent;
  props = { thing: 20 };
}
```

## `<any-component>`

Use this where you want some other component to appear.

The `is` input should be the constructor of any angular component. If this value
is changed, the previous component instance will be destroyed and replaced.

The `props` should be an object whose properties will be send to the dynamic
component instance. When the fields of this object are changed, they will also
be updated on the component instance and its `ngOnChanges` method will be called
if it exists.

## `<any-content>`

Content within `<any-content>` elements will be projected into the dynamically
created component. Each `<any-content>` should correspond to an `<ng-content>`
element in the template of the target (`is`) component.
