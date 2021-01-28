I used canvas.
First, two rectangles with inner circles are drawn. 
On each mouseDown event function checks if position of mouse is within the range of rectangle dimensions.
Then it additionally checks if position of mouse is within the range of inner circles. If it is inside
of inner circle then it starts drawing line. If only within the rectangle dimensions then it starts moving the rectangle.

Several check variables are used: check which rectangle, check which circle is start position and which
circle is end position, isDown. 

On mouseMove - position of mouse is set to each element (rectangle (x,y), line(if exists).