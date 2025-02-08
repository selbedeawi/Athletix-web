import {
  BEResponse,
  LookupValue,
} from './../../../shared/models/shared-models';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { DropdownOptionsModel } from '../../../shared/ui-components/atoms/select/select.model';
import { LookupKeys } from '../../../shared/enums/Lookup-Keys-enum';
declare var FixedID: number;
@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private http = inject(HttpClient);

  private cache = new Map<
    LookupKeys,
    BehaviorSubject<DropdownOptionsModel<number | number[]>[]>
  >();

  getOptions(
    key: LookupKeys
  ): Observable<DropdownOptionsModel<number | number[]>[]> {
    if (!this.cache.has(key)) {
      this.cache.set(
        key,
        new BehaviorSubject<DropdownOptionsModel<number | number[]>[]>([])
      );
      this.fetchOptions(key);
    }
    return this.cache.get(key)!.asObservable();
  }

  private fetchOptions(key: LookupKeys) {
    const url = `api/${key}?pageSize=1000`;
    this.http
      .get<BEResponse<LookupValue[]>>(url)
      .pipe(
        tap((options) =>
          this.cache.get(key)?.next(
            this.moveFixedIDToEnd(
              options.data?.map((city) => {
                return {
                  key: city.name,
                  value: city.id,
                  regionId: city?.regionId,
                };
              }),
              FixedID
            )
          )
        )
      )
      .subscribe();
  }
  private moveFixedIDToEnd(
    options: { key: string; value: number; regionId?: number }[],
    fixedID: number
  ) {
    const fixedItem = options.find((op) => op.value === fixedID);
    return fixedItem
      ? [...options.filter((op) => op.value !== fixedID), fixedItem]
      : options;
  }
}
