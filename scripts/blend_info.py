import bpy
import sys
import json

def get_blend_info():
    scene = bpy.context.scene
    
    # Temel bilgileri topla
    info = {
        'isAnimation': scene.frame_end > scene.frame_start,
        'startFrame': scene.frame_start,
        'endFrame': scene.frame_end,
        'renderEngine': scene.render.engine,
        'renderDevice': 'GPU' if scene.cycles.device == 'GPU' else 'CPU',
        'samples': scene.cycles.samples,
        'resolution': {
            'x': scene.render.resolution_x,
            'y': scene.render.resolution_y,
            'percentage': scene.render.resolution_percentage
        }
    }
    
    return json.dumps(info)

if __name__ == "__main__":
    # Blender dosyasını aç
    if len(sys.argv) > 1:
        blend_file = sys.argv[-1]
        bpy.ops.wm.open_mainfile(filepath=blend_file)
        print(get_blend_info()) 