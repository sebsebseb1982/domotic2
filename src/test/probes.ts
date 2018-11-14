import {ProbeDB} from "../thermospi/probes/probe-db";

ProbeDB.instance.getAllProbes().then((probes) => {
    probes.forEach((probe) => {
        probe.temperature;
    })
})