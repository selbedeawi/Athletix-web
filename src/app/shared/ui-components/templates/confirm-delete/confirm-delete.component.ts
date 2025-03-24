import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { TranslocoDirective } from "@jsverse/transloco";
import { TranslationTemplates } from "../../../enums/translation-templates-enum";
import { MatButton } from "@angular/material/button";
import { MatDivider } from "@angular/material/divider";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "app-confirm-delete",
  imports: [TranslocoDirective, MatButton, MatDialogModule],
  templateUrl: "./confirm-delete.component.html",
  styleUrl: "./confirm-delete.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteComponent {
  translationTemplate: TranslationTemplates = TranslationTemplates.GLOB;
  headerText = "DELETE_CONFIRMATION";
  content = ["DELETE_ARE_YOU_SURE_?"];
  cancelText = "CONf_CANCEL";
  acceptText = "DELETE";
  buttonColor = "bg-danger";
  enableBtns = true;
  enableImg = true;
  okText = "YES";

  constructor(
    public overlayRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.translationTemplate = this.data.translationTemplate ??
      this.translationTemplate;
    this.headerText = this.data.headerText ?? this.headerText;
    if (this.data.content) {
      this.content = (this.data.content as string).split(",") ?? this.content;
    }
    this.cancelText = this.data.cancelText ?? this.cancelText;
    this.acceptText = this.data.acceptText ?? this.acceptText;
    this.buttonColor = this.data.buttonColor ?? this.buttonColor;
    this.enableBtns = this.data.enableBtns ?? this.enableBtns;
    this.okText = this.data.okText ?? this.okText;
    this.enableImg = this.data.enableImg ?? this.enableImg;
  }
}
