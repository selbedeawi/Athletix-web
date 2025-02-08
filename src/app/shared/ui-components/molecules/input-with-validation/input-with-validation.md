# InputWithValidationPopupComponent

## Example

```html
<div class="w-100 my-3">
  <app-input-with-validation-popup
    inputClass="col-12"
    (inputModelChange)="passwordChange($event)"
    inputType="password"
    inputHint="PASSWORD"
    [inputTemplateValidator]="passwordTemplateValidator"
    inputFormName="password"
    [required]="true"
    #inputValidation
  >
  </app-input-with-validation-popup>
</div>
```

## Input

- inputClass [not mandatory]
- inputType [mandatory] input type ex -- `text`, `password`
- inputTemplateValidator [mandatory] will be of type `IValidateTemplate`
- inputHint [mandatory]
- inputFormName [not mandatory] will be `InputWithValidationPopupComponentFormName`
- required [mandatory] true or false
- showPasswordEnable [not mandatory] will set true if type is `password`

## Output

- inputModelChange [mandatory] it will emit change of input model

## Advance

- the input value is called `#inputTag` you can called it. check example
  define in component

```typescript
@ViewChild('inputValidationTag', { static: false }) inputValidationTag: InputWithValidationPopupComponent;
```

and use `this.inputValidationTag.inputTag` this give you access to input element

### What if you want to use appMatch in the input-with-validation-popUp

eays just sent `[matchInputElement]="confirmPassword"`
