import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Router } from '@angular/router';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@awesome-cordova-plugins/device-motion/ngx';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import { Howl } from 'howler';
import { DeviceOrientation } from '@awesome-cordova-plugins/device-orientation/ngx';
import { Media } from '@awesome-cordova-plugins/media/ngx';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  contra: string;
}

export interface Track {
  name: string;
  path: string;
}


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss'],
})
export class PrincipalComponent implements OnInit {
  activa: boolean = false;
  subscription: any;
  x: any;
  y: any;
  z: any;
  passwordIngresada!: string;
  usuario: any;
  passwordGuardada = sessionStorage.getItem('pass');
  player!: Howl;
  salir:boolean = false;

  playlist: Track[] = [
    {
      name: 'Derecha',
      path: '../../../assets/media/derecha.mp3'
    },
    {
      name: 'Izquierda',
      path: '../../../assets/media/izquierda.mp3'
    },
    {
      name: 'Vertical',
      path: '../../../assets/media/vertical.mp3'
    },
    {
      name: 'Horizontal',
      path: '../../../assets/media/horizontal.mp3'
    },
    {
      name: 'ContraseñaErronea',
      path: '../../../assets/media/contraseña.mp3'
    }
  ]

  constructor(public authService: AngularFireAuth, public router: Router,
    private toastr: ToastrService, private deviceMotion: DeviceMotion, private vibration: Vibration,
     private flashlight: Flashlight, private deviceOrientation: DeviceOrientation, private media: Media) {

  }

  ngOnInit() {
    this.authService.currentUser.then(user => {
      this.usuario = user?.email;
      console.log(this.usuario);
    })

    var options: DeviceMotionAccelerometerOptions = {
      frequency: 500
    }
  }

  chequearContraseña(){
    if (this.passwordIngresada == this.passwordGuardada) {
      console.log("ingresada " + this.passwordIngresada + "la mia " + this.passwordGuardada);

      //Stop watch
      this.subscription.unsubscribe();
      this.activa = false;
      this.toastr.success('Bloqueo desactivado', 'Desbloqueado', { timeOut: 1000 },);
      this.passwordIngresada = "";
      this.salir = true;
    } else {
      console.log("ingresada " + this.passwordIngresada + "la mia " + this.passwordGuardada);
      this.toastr.error("Debes ingresar la contraseña correcta para desbloquear.", "Error al desbloquear", { timeOut: 1000 });
      this.passwordIngresada = "";
      this.vibration.vibrate(5000);
      const track = this.playlist.find(item => item.name === 'ContraseñaErronea');
      if (track) {
        this.player = new Howl({
          src: [track.path]
        });
        this.player.play();
      }
      this.vibration.vibrate(5000);
      this.flashlight.switchOn();
      timer(5000).subscribe(() => {
      this.flashlight.switchOff();
      });
      this.salir = false;
    }
    return this.salir;
  }
  changeBloqueado() {
    if (this.activa) {
      this.chequearContraseña();
    } else {

      let flag = true;
      let flagAcostado = false;
      let flagIzq = true;
      let flagDer = true;

      let cont = 0;

      var options: DeviceMotionAccelerometerOptions = {
        frequency: 200
      }

      // Watch device acceleration
      this.subscription = this.deviceMotion.watchAcceleration(options).subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.x = acceleration.x;
        this.y = acceleration.y;
        this.z = acceleration.z;


        if (this.y < 1 && this.x < 1 && this.x > -1 && flagAcostado === true) {
          flagAcostado = false;
          // timer(500).subscribe(() => {
            if (this.x < 3) {

              flagAcostado = false;
              const track = this.playlist.find(item => item.name === 'Horizontal');
              if (track) {
                this.player = new Howl({
                  src: [track.path]
                });
                this.player.play();
              }
              this.vibration.vibrate(5000);
            }
          // });
        } else if (this.y > 5 || this.x > 5 || this.x < -5 && flagAcostado === false) {
          flagAcostado = true;
        }
        //       vertical y linterna
        if (this.y > 3 && flag == true) {
          flag = false;
          this.flashlight.switchOn();
          const track = this.playlist.find(item => item.name === 'Vertical');

          if (track) {
            this.player = new Howl({
              src: [track.path]
            });
            this.player.play();
          }

          timer(5000).subscribe(() => {
            if (this.y > 3) {
              flag = false;
              this.flashlight.switchOff();
            }
          });
        } else if (this.y < 3 && flag === false) {
         this.flashlight.switchOff();
          flag = true;
        }

        //       izquierda
        if (this.x > 3 && flagIzq === true) {
          flagIzq = false;
          timer(500).subscribe(() => {
            if (this.x > 3) {
              flagIzq = false;
              const track = this.playlist.find(item => item.name === 'Izquierda');

              if (track) {
                this.player = new Howl({
                  src: [track.path]
                });
                this.player.play();
              }
            }
          });
        } else if (this.x < 3 && flagIzq === false) {
          flagIzq = true;
        }

        //       derecha
        if (this.x < -3 && flagDer === true) {
          flagDer = false;
          timer(500).subscribe(() => {
            if (this.x < -3) {
              flagDer = false;

              const track = this.playlist.find(item => item.name === 'Derecha');

              if (track) {
                this.player = new Howl({
                  src: [track.path]
                });
                this.player.play();
              }
            }

          });
        } else if (this.x > -3 && flagDer === false) {
          flagDer = true;
        }

      });

      this.activa = true;

    }
  }

  logOut() {
    if(!this.activa){
      this.authService.signOut().then(() => this.router.navigate([""]));
    }else{
    const respuesta = this.chequearContraseña();
    if(respuesta){
      this.authService.signOut().then(() => this.router.navigate([""]));
    }
  }
  }
}
