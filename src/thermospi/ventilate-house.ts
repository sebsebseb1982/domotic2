import {GoogleHomeService} from "../notifications/services/googleHomeService";
import {TocToc} from "../toctoc/toctoc";

export class VentilateHouse {
    googleHome: GoogleHomeService;
    toctoc: TocToc;

    constructor() {
        this.googleHome = new GoogleHomeService();
        this.toctoc = new TocToc();
    }

    check(): void {
        this.toctoc.ifPresent(() => {

        });
    }
}