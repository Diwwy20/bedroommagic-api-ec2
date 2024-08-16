import sys
import torch
from PIL import Image
from diffusers import StableDiffusionImg2ImgPipeline
import os

def main():
    # Define the device (GPU recommended for faster processing)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Load the Stable Diffusion image generation pipeline
    pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
        "CompVis/stable-diffusion-v1-4", torch_dtype=torch.float16
    ).to(device)

    # Get the path of the uploaded image from command line arguments
    if len(sys.argv) < 3:
        print("Usage: python generate.py <image_path> <style>")
        sys.exit(1)

    image_path = sys.argv[1]
    style = sys.argv[2]

    if not os.path.exists(image_path):
        print(f"Image path does not exist: {image_path}")
        sys.exit(1)

    # Extract timestamp from the image path
    timestamp = os.path.splitext(os.path.basename(image_path))[0]

    # Open the image
    init_image = Image.open(image_path).convert("RGB")

    # Resize the image to a maximum of 768x768 pixels
    init_image.thumbnail((768, 768))

    # Define negative prompt for Stable Diffusion
    prompt = f"{style} style bedroom"
    negative_prompt = "(((Ugly))), low-resolution, morbid, blurry, cropped, deformed, disfigured, extra arms, extra fingers, extra legs, gross proportions, long neck, tiling, poorly drawn feet, distorted face, low quality, watermark, water mark"

    try:
        # Generate images using Stable Diffusion
        generated_images = []
        for i in range(1, 4):
            output_filename = f"{timestamp}_{i}.jpg"
            output_path = os.path.join('static', 'generate', output_filename)
            image_output = pipe(prompt, init_image, strength=0.7, guidance_scale=10, negative_prompt=negative_prompt).images[0]

            # Ensure the output directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)

            # Save the generated image
            image_output.save(output_path)
            generated_images.append(output_filename)

        # Print generated image filenames for the Node.js script to read
        for filename in generated_images:
            print(filename)
    except Exception as e:
        print(f"Error during image generation: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
