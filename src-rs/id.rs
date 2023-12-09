#[must_use]
#[allow(clippy::expect_used)] // it is hilariously improbable that we will generate more than 1 septillion IDs per millisecond
pub fn id() -> String {
    ulid::Generator::new()
        .generate()
        .expect("tried to generate more than 1.21e+24 IDs in a single millisecond")
        .to_string()
}
