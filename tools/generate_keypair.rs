use jwt_simple::algorithms::Ed25519KeyPair;

fn main() {
    let keypair = Ed25519KeyPair::generate();
    let keypair = keypair.to_bytes();
    println!("{}", hex::encode(keypair));
}
