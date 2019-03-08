import java.awt.Color;
import java.awt.Graphics;

public final class Checker
{
    private final static int DIMENSION = 50;

    private CheckerType checkerType;

    private int x, y;

    public Checker(CheckerType checkerType, int cx, int cy)
    {
        this.checkerType = checkerType;
        x = cx;
        y = cy;
    }

    public CheckerType getCheckerType(){
        return this.checkerType;
    }

    public void setType(CheckerType a){
        this.checkerType = a;
    }

    public int getX(){
        return x;
    }

    public int getY(){
        return y;
    }

    public void setX(int cx){
        x = cx;
    }

    public void setY(int cy){
        y = cy;
    }

    public void draw(Graphics g, int cx, int cy)
    {
        if(!checkerType.equals(CheckerType.EMPTY)){
            int x = cx - DIMENSION / 2;
            int y = cy - DIMENSION / 2;

            // Set checker color.

            g.setColor(checkerType == CheckerType.BLACK_REGULAR ||
                    checkerType == CheckerType.BLACK_KING ? Color.BLACK :
                    Color.RED);

            // Paint checker.

            g.fillOval(x, y, DIMENSION, DIMENSION);
            g.setColor(Color.WHITE);
            g.drawOval(x, y, DIMENSION, DIMENSION);

            if (checkerType == CheckerType.RED_KING ||
                    checkerType == CheckerType.BLACK_KING)
                g.drawString("K", cx, cy);
        }
    }

    public static boolean contains(int x, int y, int cx, int cy)
    {
        return (cx - x) * (cx - x) + (cy - y) * (cy - y) < DIMENSION / 2 *
                DIMENSION / 2;
    }

    public static int getDimension()
    {
        return DIMENSION;
    }
}