import sys
from PIL import Image, ImageDraw, ImageFont

def draw_all(input_path, output_path):
    # Buka gambar asli yang bersih
    original_img = Image.open(input_path)
    
    # Buat kanvas baru yang lebih TINGGI (ditambah 120 pixel di bawah untuk teks)
    new_height = original_img.height + 120
    img = Image.new('RGB', (original_img.width, new_height), 'white')
    
    # Tempelkan gambar asli di bagian atas (sehingga tidak ada yang terpotong/tertutup)
    img.paste(original_img, (0, 0))
    
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype('C:\\Windows\\Fonts\\arial.ttf', 22)
    except IOError:
        font = ImageFont.load_default()
        
    # Koordinat persis sama dengan Desain_Smart_Bin_Full_Update.png (permintaan user)
    labels = [
        {'text': 'Powerbank', 'box_x': 30, 'box_y': 100, 'dot_x': 340, 'dot_y': 170},
        {'text': 'Breadboard', 'box_x': 30, 'box_y': 170, 'dot_x': 390, 'dot_y': 160},
        {'text': 'Resistor', 'box_x': 30, 'box_y': 240, 'dot_x': 380, 'dot_y': 180},
        {'text': 'Mikrokontroler ESP32', 'box_x': 30, 'box_y': 310, 'dot_x': 330, 'dot_y': 190},
        {'text': 'Kabel Jumper', 'box_x': 30, 'box_y': 380, 'dot_x': 410, 'dot_y': 200},
        {'text': 'Sensor Ultrasonik\n(HC-SR04)', 'box_x': 30, 'box_y': 450, 'dot_x': 365, 'dot_y': 220},
        {'text': 'Layar LCD', 'box_x': 750, 'box_y': 150, 'dot_x': 730, 'dot_y': 320},
    ]
    
    padding_x = 8
    padding_y = 6
    dot_radius = 5
    
    for lbl in labels:
        bbox = draw.multiline_textbbox((0, 0), lbl['text'], font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        rect_left = lbl['box_x']
        rect_top = lbl['box_y']
        rect_right = lbl['box_x'] + text_width + 2 * padding_x
        rect_bottom = lbl['box_y'] + text_height + 2 * padding_y
        
        if lbl['dot_x'] > rect_right:
            line_start_x = rect_right
        else:
            line_start_x = rect_left
            
        line_start_y = lbl['box_y'] + (rect_bottom - rect_top) // 2
        
        draw.line([(line_start_x, line_start_y), (lbl['dot_x'], lbl['dot_y'])], fill='black', width=2)
        draw.ellipse([(lbl['dot_x'] - dot_radius, lbl['dot_y'] - dot_radius), 
                      (lbl['dot_x'] + dot_radius, lbl['dot_y'] + dot_radius)], fill='red')
        draw.rectangle([(rect_left, rect_top), (rect_right, rect_bottom)], fill='white', outline='black', width=2)
        draw.multiline_text((lbl['box_x'] + padding_x, lbl['box_y'] + padding_y - 2), lbl['text'], fill='black', font=font, spacing=4)
        
    title_text = 'Gambar 4.1 Desain Smart Bin Tahap Pertama\nKeterangan: (a) Komponen Dalam dan (b) Tampak Luar'
    try:
        title_font = ImageFont.truetype('C:\\Windows\\Fonts\\arial.ttf', 28)
    except:
        title_font = font
        
    title_bbox = draw.multiline_textbbox((0, 0), title_text, font=title_font, align='center')
    title_width = title_bbox[2] - title_bbox[0]
    title_x = (img.width - title_width) // 2
    
    # Tulis teks di area putih baru yang ditambahkan di bawah gambar (tidak nabrak roda)
    title_y = original_img.height + 20 
    
    draw.multiline_text((title_x, title_y), title_text, fill='black', font=title_font, align='center')
    
    img.save(output_path)
    print(f'Saved to {output_path}')

if __name__ == '__main__':
    # Pakai polos untuk mencegah teks dobel, tapi pakai susunan Full Update
    draw_all('Desain_Smart_Bin_Polos.png', 'Desain_Smart_Bin_Caption_Fixed.png')
