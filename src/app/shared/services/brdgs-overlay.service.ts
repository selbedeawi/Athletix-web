import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal, ComponentType } from "@angular/cdk/portal";
import { Injectable, InjectionToken, Injector } from "@angular/core";
import { fromEvent, Subject, take } from "rxjs";

export const BRDGS_OVERLAY_DATA = new InjectionToken<any>("BRDGS_OVERLAY_DATA");

@Injectable({
  providedIn: "root",
})
export class BrdgsOverlayService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<T, D = any>(
    component: ComponentType<T>,
    data?: D,
  ): BrdgsOverlayRef<T, D> {
    const overlayRef = this.overlay.create({
      height: "100vh",
      maxWidth: "440px",
      width: "100%",
      hasBackdrop: true,
      panelClass: "Brdgs-overlay-panel-class",
      backdropClass: "Brdgs-overlay-backdrop-class",
      disposeOnNavigation: true,
    });

    const brdgsOverlayRef = new BrdgsOverlayRef<T, D>(overlayRef);

    const injector = Injector.create({
      providers: [
        { provide: BRDGS_OVERLAY_DATA, useValue: data },
        { provide: BrdgsOverlayRef, useValue: brdgsOverlayRef },
      ],
      parent: this.injector,
    });

    const componentPortal = new ComponentPortal(component, null, injector);
    overlayRef.attach(componentPortal);

    return brdgsOverlayRef;
  }
}

export class BrdgsOverlayRef<T, D = any> {
  private afterClosedSubject = new Subject<any>();
  afterClosed$ = this.afterClosedSubject.asObservable();

  constructor(private overlayRef: OverlayRef) {}

  close(result?: any): void {
    const element = this.overlayRef.overlayElement;

    fromEvent(element, "animationend")
      .pipe(take(1))
      .subscribe(() => {
        this.overlayRef.dispose();
        this.afterClosedSubject.next(result);
        this.afterClosedSubject.complete();
      });
    element.classList.add("closing");
  }
}
