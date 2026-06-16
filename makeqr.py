import qrcode

# 1. Paste your sensitive link or data here
sensitive_data = "YOUR_LINK_HERE"

# 2. Configure the QR code generator
qr = qrcode.QRCode(
    version=1,  # Controls the size of the QR Code (1 is smallest)
    error_correction=qrcode.constants.ERROR_CORRECT_L,  # About 7% error correction
    box_size=10,  # How many pixels each "box" of the QR code is
    border=4,  # Thickness of the border (minimum is 4)
)

# 3. Add the data and generate the grid
qr.add_data(sensitive_data)
qr.make(fit=True)

# 4. Create the image and save it locally
img = qr.make_image(fill_color="black", back_color="white")
img.save("my_qr.png")

print("Success! Your QR code has been saved locally as 'my_qr.png'.")