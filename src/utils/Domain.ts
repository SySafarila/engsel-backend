export default class Domain {
  static clear(domain: string): string {
    let final: string = domain;

    if (final.startsWith("http://")) {
      final = final.replace("http://", "");
    }

    if (final.startsWith("https://")) {
      final = final.replace("https://", "");
    }

    if (final.split("/").length > 1) {
      final = final.split("/")[0];
    }

    if (final.split("?").length > 1) {
      final = final.split("?")[0];
    }

    if (final.split(":").length > 1) {
      final = final.split(":")[0];
    }

    return final;
  }
}
