precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex0;
uniform vec2 offset;
uniform float time;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec2 distortion = vec2(cos(uv.y * offset.x + time*0.1) *offset.y, sin(uv.y * offset.x + time)* offset.y);
  float slides = uv.y * offset.x + time *0.5;
  slides = fract(slides);
  
  vec4 tex = texture2D(tex0, uv + distortion);


  gl_FragColor = tex;
}