export class HTML {
    formatList(elements: string[]) {
        let lis = '';
        elements.forEach((element) => {
            lis += `<li>${element}</li>`;
        })

        return `<ul>${lis}</ul>`;
    }
}