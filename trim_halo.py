from PIL import Image

img = Image.open("Referensi_Smart_Bin_Transparan.png").convert("RGBA")
width, height = img.size
pixels = img.load()

# We will erode the bright pixels on the boundary of the transparent background
def trim_halo(passes):
    for i in range(passes):
        to_remove = []
        for y in range(1, height - 1):
            for x in range(1, width - 1):
                r, g, b, a = pixels[x, y]
                # If pixel is opaque and is light grey/white (the anti-aliasing artifact)
                if a == 255 and r > 110 and g > 110 and b > 110:
                    # Check if it borders a transparent pixel
                    is_boundary = False
                    # Check 8 neighbors
                    for dx, dy in [(0, 1), (1, 0), (0, -1), (-1, 0), (1, 1), (-1, -1), (1, -1), (-1, 1)]:
                        if pixels[x+dx, y+dy][3] == 0:
                            is_boundary = True
                            break
                    
                    if is_boundary:
                        to_remove.append((x, y))
                        
        for x, y in to_remove:
            pixels[x, y] = (255, 255, 255, 0)
        print(f"Pass {i+1}: removed {len(to_remove)} halo pixels.")

trim_halo(3) # 3 passes should clear the thick white jagged edges

img.save("Referensi_Smart_Bin_Transparan.png")
print("Halo completely trimmed.")
