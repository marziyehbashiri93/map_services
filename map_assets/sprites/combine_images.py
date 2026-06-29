import json
from pathlib import Path
from PIL import Image


ROOT_DIR = Path(__file__).resolve().parent
ICON_DIR = ROOT_DIR / "icon_v3"
OUTPUTS = (
    {"name": "sprite", "scale": 1.0, "pixel_ratio": 1},
    {"name": "sprite@2x", "scale": 2.0, "pixel_ratio": 2},
)

# MapLibre Native rejects sprite rects with width or height > 1024 (see mbgl/sprite/sprite_parser.cpp).
MAX_ICON_PX = 1024


def load_images():
    image_paths = sorted(ICON_DIR.glob("*.png"))
    valid_images = []

    for image_path in image_paths:
        try:
            with Image.open(image_path) as img:
                valid_images.append((image_path.name, img.convert("RGBA").copy()))
        except Exception as err:
            print(f"error opening image {image_path.name}: {err}")

    return valid_images


def scaled_size(width, height, scale):
    return max(1, int(round(width * scale))), max(1, int(round(height * scale)))


def clamp_to_max_extent(img: Image.Image) -> Image.Image:
    w, h = img.size
    if w <= MAX_ICON_PX and h <= MAX_ICON_PX:
        return img
    factor = min(MAX_ICON_PX / w, MAX_ICON_PX / h)
    nw = max(1, int(round(w * factor)))
    nh = max(1, int(round(h * factor)))
    return img.resize((nw, nh), Image.Resampling.LANCZOS)


def build_sprite(valid_images, scale, pixel_ratio):
    prepared = []
    for image_name, img in valid_images:
        target_size = scaled_size(img.width, img.height, scale)
        resized = img.resize(target_size, Image.Resampling.LANCZOS) if scale != 1.0 else img.copy()
        resized = clamp_to_max_extent(resized)
        prepared.append((image_name, resized))

    total_width = sum(img.width for _, img in prepared)
    max_height = max(img.height for _, img in prepared)
    combined = Image.new("RGBA", (total_width, max_height), (0, 0, 0, 0))

    sprite_data = {}
    current_x = 0
    for image_name, img in prepared:
        combined.paste(img, (current_x, 0))
        sprite_data[image_name] = {
            "x": current_x,
            "y": 0,
            "width": img.width,
            "height": img.height,
            "pixelRatio": pixel_ratio,
            "visible": True,
        }
        current_x += img.width

    return combined, sprite_data


def save_outputs(name, image, sprite_data):
    image_path = ROOT_DIR / f"{name}.png"
    json_path = ROOT_DIR / f"{name}.json"
    image.save(image_path)
    with open(json_path, "w") as out:
        json.dump(sprite_data, out, indent=2)
    print(f"generated {image_path.name} and {json_path.name}")


def main():
    valid_images = load_images()
    if not valid_images:
        print("no valid PNG icons found for sprite generation.")
        return

    for output in OUTPUTS:
        image, sprite_data = build_sprite(
            valid_images=valid_images,
            scale=output["scale"],
            pixel_ratio=output["pixel_ratio"],
        )
        save_outputs(output["name"], image, sprite_data)

    print("sprite generation completed for desktop and mobile.")


if __name__ == "__main__":
    main()