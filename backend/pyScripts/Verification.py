from library.siamese import SiameseFaceNet
import os
import sys

def main():
    label = sys.argv[1]

    fnet = SiameseFaceNet()
    model_dir_path = './models'
    fnet.load_model(model_dir_path)

    database = dict()
    database[label] = []

    image_dir_path = './data/' + label + '/left'
    imgs = os.listdir(image_dir_path)
    for img in imgs:
        if (not img.endswith('.jpg')):
            continue
        database[label].append(fnet.img_to_encoding(image_dir_path+'/'+img))

    image_dir_path = './data/' + label + '/right'
    imgs = os.listdir(image_dir_path)
    for img in imgs:
        if(not img.endswith('.jpg')):
            continue
        database[label].append(fnet.img_to_encoding(image_dir_path + '/' + img))

    dist, isvalid = fnet.verify('./data/TEMP/temp/00001sq.jpg', label, database, 0.5)

    if(isvalid==True):
        return 0
    else:
        return -1

if __name__ == '__main__':
    main()