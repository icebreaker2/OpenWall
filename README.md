# OpenWall
Hier entsteht die Softwarebasis für das OpenWall-Projekt. Der Code läuft auch auf einem [Raspberry Pi 2](https://www.raspberrypi.org).<br>
Für die Installation (von NodeJS und MeteorJS) siehe:

* https://github.com/4commerce-technologies-AG/meteor
* http://meteor-universal.tumblr.com/post/111851816699/install-meteor-universal-on-raspberry-pi-2 <br>

Auf einem Raspberry Pi der 1. Generation ist die Ausführung auch möglich, jedoch mit spürbar längeren Lade- und Startzeiten verbunden.

## Meteor
Dieser Ordner enthält die MeteorJS-Applikation. [MeteorJS](http://meteor.com) ist eine OpenSource-App-Plattform auf der Basis von NodeJS. MeteorJS muss auf dem Rechner installiert sein (verfügbar für Linux, Mac und Windows).

Der Server kann im Ordner Meteor gestartet werden per (Stadard-Port 3000):
```
$ meteor
```

oder um direkt auf Port 80 zu starten:
```
$ meteor --port 80
```

## Asteroid
Dieser Ordner enthält die Datei boxController.js<br>
Ausgeführt mit [NodeJS](http://nodejs.org), steuert sie einen per USB angeschlossenen [Arduino](http://arduino.cc) (für die LEDs und Motoren).<br> Folgende Abhängigkeiten müssen hier per npm installiert werden:

```
$ npm install asteroid
```

```
$ npm install johnny-five
```

Zum Starten muss Folgendes im Ordner Asteroid (in einem neuen Terminal-Fenster) ausgeführt werden:

```
$ node boxController.js
```

oder um direkt auf Port 80 zu starten:
```
$ node boxController.js 80
```
