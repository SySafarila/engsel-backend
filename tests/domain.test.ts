import Domain from "../src/utils/Domain";

describe("Domain clear", () => {
  it("Should clear", async () => {
    const test1 = Domain.clear("testing");
    expect(test1).toBe("testing");

    const test2 = Domain.clear("http://testing");
    expect(test2).toBe("testing");

    const test3 = Domain.clear("https://testing");
    expect(test3).toBe("testing");

    const test4 = Domain.clear("https://testing.com");
    expect(test4).toBe("testing.com");

    const test5 = Domain.clear("https://testing.com/");
    expect(test5).toBe("testing.com");

    const test6 = Domain.clear("https://testing.com/path/other?key=value");
    expect(test6).toBe("testing.com");

    const test7 = Domain.clear("https://testing.com?key=value");
    expect(test7).toBe("testing.com");

    const test8 = Domain.clear("https://testing.com:3000");
    expect(test8).toBe("testing.com");
  });
});
