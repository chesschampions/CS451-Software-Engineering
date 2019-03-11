import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;

import java.awt.event.MouseEvent;
import java.awt.event.MouseAdapter;

import java.util.ArrayList;
import java.util.List;

import javax.swing.JComponent;

public class Board extends JComponent
{
    // dimension of checkerboard square (25% bigger than checker)

    private final static int SQUAREDIM = (int) (Checker.getDimension() * 1.25);

    // dimension of checkerboard (width of 8 squares)

    private final int BOARDDIM = 8 * SQUAREDIM;

    // preferred size of Board component

    private Dimension dimPrefSize;

    // the selected player

    private PosCheck posCheck;

    //a list of pieces for the GUI

    private List<PosCheck> posChecks;

    //current location of all of the pieces for the AI

    private Checker[][] pieces;

    public Board(Checker[][] startingPieces)
    {
        pieces = startingPieces;
        posChecks = new ArrayList<>();
        dimPrefSize = new Dimension(BOARDDIM, BOARDDIM);

        addMouseListener(new MouseAdapter()
        {
            @Override
            public void mousePressed(MouseEvent me)
            {
                // Obtain mouse coordinates at time of press.

                int x = me.getX();
                int y = me.getY();

                // Locate positioned checker under mouse press.

                for (PosCheck posCheck: posChecks) {
                    if (Checker.contains(x, y, posCheck.cx,
                            posCheck.cy)) {
                        Board.this.posCheck = posCheck;
                        System.out.println(Board.this.posCheck.checker.getX() + " " + Board.this.posCheck.checker.getY() + " Type: " + Board.this.posCheck.checker.getCheckerType());
                        break;
                    }
                }

            }

        });

    }

    public List<PosCheck> getPosChecks() {
        return posChecks;
    }

    public void add(Checker checker, int row, int col)
    {
        if (row < 1 || row > 8)
            throw new IllegalArgumentException("row out of range: " + row);
        if (col < 1 || col > 8)
            throw new IllegalArgumentException("col out of range: " + col);
        PosCheck posCheck = new PosCheck();
        posCheck.checker = checker;
        posCheck.cx = (col - 1) * SQUAREDIM + SQUAREDIM / 2;
        posCheck.cy = (row - 1) * SQUAREDIM + SQUAREDIM / 2;
        for (PosCheck _posCheck: posChecks)
            if (posCheck.cx == _posCheck.cx && posCheck.cy == _posCheck.cy && !_posCheck.checker.getCheckerType().equals(CheckerType.EMPTY))
                throw new AlreadyOccupiedException("square at (" + row + "," +
                        col + ") is occupied");
        posChecks.add(posCheck);
    }

    @Override
    public Dimension getPreferredSize()
    {
        return dimPrefSize;
    }

    @Override
    protected void paintComponent(Graphics g)
    {
        paintCheckerBoard(g);
        for (PosCheck posCheck: posChecks)
            if (posCheck != Board.this.posCheck)
                posCheck.checker.draw(g, posCheck.cx, posCheck.cy);

        // Draw dragged checker last so that it appears over any underlying
        // checker.

        if (posCheck != null)
            posCheck.checker.draw(g, posCheck.cx, posCheck.cy);
    }

    private void paintCheckerBoard(Graphics g)
    {
        ((Graphics2D) g).setRenderingHint(RenderingHints.KEY_ANTIALIASING,
                RenderingHints.VALUE_ANTIALIAS_ON);

        // Paint checkerboard.

        for (int row = 0; row < 8; row++)
        {
            g.setColor(((row & 1) != 0) ? Color.BLACK : Color.WHITE);
            for (int col = 0; col < 8; col++)
            {
                g.fillRect(col * SQUAREDIM, row * SQUAREDIM, SQUAREDIM, SQUAREDIM);
                g.setColor((g.getColor() == Color.BLACK) ? Color.WHITE : Color.BLACK);
            }

        }
    }

    public void printPieces(){
        for(int i = 0; i < 8; i++){
            for(int j = 0; j < 8; j++){
                if(pieces[i][j]==null){
                    System.out.print("[ ]");
                } else if(pieces[i][j].getCheckerType().equals(CheckerType.BLACK_REGULAR)){
                    System.out.print("[B]");
                } else{
                    System.out.print("[R]");
                }
            }
            System.out.println();
        }
    }

}