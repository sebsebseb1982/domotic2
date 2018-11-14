import {ProbeDB} from "../thermospi/probes/probe-db";

ProbeDB.instance.getProbesBySite(1).then((probes) => {
    console.log(probes);
    probes.forEach((probe) => {
        probe.temperature;
    })
})