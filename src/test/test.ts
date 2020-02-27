interface IDemarrable {
    demarrer();
}

class Parking {
    vehicules: IDemarrable[];

    demarrerTousMesVehicules() {
        this.vehicules.forEach(
            (vehicule) => {
                vehicule.demarrer();
            }
        )
    }
}




class Avion implements IDemarrable {
    demarrer() {
        console.log('Mon avion démarre');
    }
}

class Voiture implements IDemarrable {
    nbRoue: number;
    couleur: string;

    ouvrirLaPorte(numeroPorte: number): string {
        return `Porte ${numeroPorte} ouverte !`;
    };

    demarrer() {
        console.log('Ma voiture démarre');
    }
}

class Batterie {
    charge:boolean;
}

class Hybride extends Voiture {
    batterie: Batterie;

    demarrer() {
        console.log('Ma voiture hybride démarre');
    }
}

let yaris = new Hybride();

yaris.batterie.charge;

let parkingPeixotto = new Parking();
parkingPeixotto.vehicules.push(yaris);
parkingPeixotto.demarrerTousMesVehicules();

yaris.couleur = "rouge";
yaris.nbRoue = 4;
yaris.ouvrirLaPorte(1);