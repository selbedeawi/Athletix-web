import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';
import { InputComponent } from '../../../../shared/ui-components/atoms/input/input.component';
import { SelectComponent } from '../../../../shared/ui-components/atoms/select/select.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslationTemplates } from '../../../../shared/enums/translation-templates-enum';
import { APP_ROUTES } from '../../../../core/enums/pages-urls-enum';
import { BridgesInputType } from '../../../../shared/ui-components/atoms/input/enum/bridges-input-type.enum';
import { LookupService } from '../../../../core/services/lookup/lookup.service';
import { DatePickerComponent } from '../../../../shared/ui-components/atoms/date-picker/date-picker.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-book-session-dialog',
  imports: [
    FormsModule,
    InputComponent,
    TranslocoDirective,
    MatButtonModule,
    MatCheckboxModule,
    DatePickerComponent,
  ],
  templateUrl: './book-session-dialog.component.html',
  styleUrl: './book-session-dialog.component.scss',
})
export class BookSessionDialogComponent {
  private dialogRef = inject(MatDialogRef<BookSessionDialogComponent>);
  translationTemplate = TranslationTemplates.PT_SESSION;
  APP_ROUTES = APP_ROUTES;

  bridgesInputType = BridgesInputType;
  lookupService = inject(LookupService);
  closeDialog(): void {
    this.dialogRef.close();
  }
}
