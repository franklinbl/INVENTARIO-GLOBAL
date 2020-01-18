import { Component, OnInit, OnDestroy } from '@angular/core';
import { Abonos } from 'src/app/interfaces/interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, AlertController, ToastController, MenuController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';

@Component({
  selector: 'app-add-abono',
  templateUrl: './add-abono.page.html',
  styleUrls: ['./add-abono.page.scss'],
})
export class AddAbonoPage implements OnInit, OnDestroy {

  load: any;
  colorLabel: string;

  idCuenta: number;
  tiempoToast = 1750;
  abonos: Abonos[] = [];
  abono = {
    monto: undefined,
    fecha: undefined,
    descripcion: undefined
  };

  colorSeleccionado: any = undefined;

  constructor(
    private dbLocalStorage: LocalStorageService,
    private dbSQLite: SqliteBDService,
    private router: Router,
    private navCtrl: NavController,
    private rutaActiva: ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    public menuCtrl: MenuController,
    private loading: LoadingController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.idCuenta = this.rutaActiva.snapshot.params.id;
    console.log(this.idCuenta);

    this.dbLocalStorage.getColor().subscribe(color => {
      console.log('COLOR', color);
      this.colorSeleccionado = color;
    });

    this.dbLocalStorage.getTema().then(tema => {
      console.log('TEMA', tema);
      if (tema === true) {
        this.colorLabel = 'blancoUno';
      } else {
        this.colorLabel = 'negroUno';
      }
    });
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true);
  }

  async presentToast(mensaje, duracion) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  addAbono() {

    this.presentLoading().then(() => {
      if (this.abono.monto === undefined) {
        this.load.dismiss();
        return this.presentToast('El campo monto no puede estar vacio', this.tiempoToast);
      } else {
        if (this.abono.fecha === undefined) {
          this.load.dismiss();
          return this.presentToast('El campo fecha no puede estar vacio', this.tiempoToast);
        } else {
          console.log(this.abono.monto, this.abono.fecha, this.abono.descripcion, this.idCuenta);
          this.dbSQLite.addAbono(this.abono.monto, this.abono.fecha, this.abono.descripcion, this.idCuenta)
            .then(_ => {
              this.abono = {
                monto: undefined,
                fecha: undefined,
                descripcion: undefined
              };
              this.navCtrl.pop();
              this.presentToast('La cuenta se a añadido exitosamente', this.tiempoToast);
            });
        }
      }
      this.load.dismiss();
    });

  }

  async presentLoading() {
    this.load = await this.loading.create({
      message: 'Agregando Abono',
      keyboardClose: true,
      spinner: 'lines'
    });
    await this.load.present();
  }

}