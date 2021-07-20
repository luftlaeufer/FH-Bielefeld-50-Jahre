 #ifdef GL_ES
precision mediump float;
#endif

#define PROCESSING_COLOR_SHADER

uniform vec2 iResolution;
uniform float iAni;
uniform sampler2D img;
uniform int iBlobCount;
uniform float iBoarderWidth;
uniform float iMalePos;
uniform float iFemalePos;


vec4 col;
float pixelPower;
const float powerTreshold = .01;
int numberOfMetaballs;
const float lineSize = 10000.0;
float norm;
vec2 fragCoord;

float scaleFactor = 3.0;
float boarder;
vec4 bgCol = vec4(0.1);

vec3 colors[5];

colors[0] = vec3(84.0, 56, 138);	//UNDER MALE
colors[1] = vec3(81, 149, 188); // MALE
colors[2] = vec3(99, 169, 68); // DIVERSE
colors[3] = vec3(201, 16, 139); //FEMALE
colors[4] = vec3(240, 112, 23); //OVER FEMALE

// const vec3 colors[] = vec3[](
// vec3(84, 56, 138) / 255.,	//UNDER MALE
// vec3(81, 149, 188) / 255., // MALE
// vec3(99, 169, 68) / 255., // DIVERSE
// vec3(201, 16, 139) / 255., //FEMALE
// vec3(240, 112, 23) / 255.); //OVER FEMALE



float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float MetaNum(int metaballNumber)
{
	float metaNum = 0.0;
	if (metaballNumber == 0){
		metaNum = 0.0;
	} else if (metaballNumber == numberOfMetaballs - 1){
		metaNum = 1.0;
	} else {
		metaNum = ((float(metaballNumber) * 2) + 1 ) / float(numberOfMetaballs * 2);
	}
	return metaNum;	
}

vec3 RAMP(vec3 cols[5], float x){ //fill in how many colors in palette
    vec3 col = cols[0];
    float step_size = 1./(float(cols.length())-1.);
    for(int i = 0; i < cols.length()-1; i++){
        col =mix(col, cols[i+1], smoothstep(float(i)*step_size, (float(i)+1.)*step_size, x));
        
    }
    return col;
}

vec3 ColorOfMetaball(int metaballNumber)
{
	vec3 metaColor = vec3(0.0);

	float metaNum = MetaNum(metaballNumber);
	float r = texture(img, vec2(metaNum,iAni)).g;
	r = map(r, iMalePos, iFemalePos, .25, .75);
	metaColor = RAMP(colors, r);
	
	return metaColor;
}

vec2 PositionOfMetaball(int metaballNumber)
{
	vec2 metaPos = vec2(0,0);
	float metaNum = MetaNum(metaballNumber);
	metaPos = texture(img, vec2(metaNum,iAni)).rg;
  metaPos.x = metaPos.x * (iResolution.x / iResolution.y);
	
	return metaPos;
}

float RadiusOfMetaball(int metaballNumber)
{
	float radius = 0.0;
	float metaNum = MetaNum(metaballNumber);

	radius = float( texture(img, vec2(metaNum,iAni)).b );
	if(metaballNumber <= 1){
		radius = ( float(scaleFactor) * 0.01) * float(sqrt(float(radius) / float(scaleFactor) ) );
	} else {
		radius = 0.33 *  ( float(scaleFactor) * 0.01) * float(sqrt(float(radius) / float(scaleFactor) ) );
	}
	return radius;
}

//float norm;
float Norm(float num)
{
	//float norm = 0.9;
	float res = pow(num, norm);
	return res;	
}

float SquareDistanceToMetaball(int metaballNumber)
{
	vec2 metaPos = PositionOfMetaball(metaballNumber);
	vec2 pixelPos = fragCoord.xy / iResolution.xy;
  pixelPos.x = pixelPos.x * iResolution.x / iResolution.y;
	vec2 distanceVector = pixelPos - PositionOfMetaball(metaballNumber);
	distanceVector = vec2(abs(distanceVector.x), abs(distanceVector.y));	
	float normDistance = Norm(distanceVector.x) + Norm(distanceVector.y);
	
	return normDistance;
}

float PowerOfMetaball(int metaballNumber)
{
	float power = 0.0;
	
	float radius = RadiusOfMetaball(metaballNumber);
	float squareDistance = SquareDistanceToMetaball(metaballNumber);
	
	
	power = Norm(radius) / squareDistance;
	return power;
}

vec3 CalculateColor(float maxPower)
{
	vec3 val = vec3(0.0);
					
	for(int i = 0; i < numberOfMetaballs; i++)
	{
		val += ColorOfMetaball(i) * (PowerOfMetaball(i) / maxPower);
	}
	
	return val;
}

void Metaballs()
{
	vec4 val;
	pixelPower = .0;
	col = vec4(0.0);
	int powerMeta = 0;
	float maxPower = 0.0;
	for(int i = 0; i < numberOfMetaballs; i++)
	{
		float power = PowerOfMetaball(i);
		pixelPower 	+= power;
		if(maxPower < power)
		{
			maxPower = power;
			powerMeta = i;
		}
		power *= RadiusOfMetaball(i);
		
		//val += ColorOfMetaball(i) * power;
	}
	
	val = vec4(CalculateColor(maxPower), 1);
	boarder = iBoarderWidth;

	if(pixelPower < powerTreshold - boarder || pixelPower > powerTreshold - boarder  + Norm(lineSize))
	{
		val = bgCol;
	}

	if(pixelPower < powerTreshold && pixelPower > (powerTreshold - boarder ) )
	{	
		float r = map(pixelPower, powerTreshold,  (powerTreshold - boarder ), val.r, bgCol.r  );
		float g = map(pixelPower, powerTreshold,  (powerTreshold - boarder ), val.g, bgCol.g );
		float b = map(pixelPower, powerTreshold,  (powerTreshold - boarder ), val.b, bgCol.b );
		float a = map(pixelPower, powerTreshold,  (powerTreshold - boarder ), val.a, bgCol.a );

		val = vec4(r, g, b, a);
	}
	
	col = vec4(val);
}

void main() 
{
  fragCoord = gl_FragCoord.st;
	norm = 2.0;  //mod(iTime, 5.0);
	numberOfMetaballs = iBlobCount;
	Metaballs();

	//col = vec4(iMouse.xy / iResolution.xy, 0.0, 1.0);
	gl_FragColor = col;
}