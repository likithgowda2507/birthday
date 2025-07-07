from PIL import Image

def encrypt_image(input_image, output_image, key):
    image = Image.open(input_image).convert("RGBA")  # Convert to RGBA for consistency
    encrypted_image = Image.new("RGBA", image.size)
    pixels = image.load()
    encrypted_pixels = encrypted_image.load()

    for x in range(image.width):
        for y in range(image.height):
            r, g, b, a = pixels[x, y]
            r_enc = (r + key) % 256
            g_enc = (g + key) % 256
            b_enc = (b + key) % 256
            encrypted_pixels[x, y] = (r_enc, g_enc, b_enc, a)

    encrypted_image.save(output_image)
    print(f"\n Encrypted image saved as: {output_image}")
    print(" Displaying input and encrypted image...")
    image.show(title="Original Image")
    encrypted_image.show(title="Encrypted Image")

def decrypt_image(encrypted_image, decrypted_output, key):
    image = Image.open(encrypted_image).convert("RGBA")
    decrypted_image = Image.new("RGBA", image.size)
    pixels = image.load()
    decrypted_pixels = decrypted_image.load()

    for x in range(image.width):
        for y in range(image.height):
            r, g, b, a = pixels[x, y]
            r_dec = (r - key) % 256
            g_dec = (g - key) % 256
            b_dec = (b - key) % 256
            decrypted_pixels[x, y] = (r_dec, g_dec, b_dec, a)

    decrypted_image.save(decrypted_output)
    print(f"\n Decrypted image saved as: {decrypted_output}")
    print(" Displaying encrypted and decrypted image...")
    image.show(title="Encrypted Image")
    decrypted_image.show(title="Decrypted Image")

def main():
    print("===  Image Pixel Encryption Tool ===")

    input_image = input("Enter input image path (e.g., image.png): ").strip('"')
    encrypted_image_name = input("Enter output name for encrypted image (e.g., encrypted.png): ").strip('"')

    try:
        key = int(input("Enter encryption key (0–255): "))
        if not (0 <= key <= 255):
            raise ValueError
    except ValueError:
        print(" Invalid key. Must be an integer between 0 and 255.")
        return

    encrypt_image(input_image, encrypted_image_name, key)

    # Ask user if they want to decrypt
    choice = input("\nDo you want to decrypt the encrypted image now? (yes/no): ").strip().lower()
    if choice in ['yes', 'y']:
        decrypted_image_name = input("Enter output name for decrypted image (e.g., decrypted.png): ").strip('"')
        decrypt_image(encrypted_image_name, decrypted_image_name, key)
    else:
        print("Encryption complete. Decryption skipped.")

if __name__ == "__main__":
    main()