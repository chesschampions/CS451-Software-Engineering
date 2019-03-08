import java.awt.EventQueue;
import java.util.List;

import javax.swing.JFrame;

public class Checkers extends JFrame
{
    private final static int ROWS = 8;
    private final static int COLUMNS = 8;

    private Checker[][] pieces = new Checker[ROWS][COLUMNS];

    public Checkers(String title)
    {
        super(title);
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        pieces = setupPiecesArray();
        Board board = setupNewGame();
        board.printPieces();
        setContentPane(board);

        pack();
        setVisible(true);
    }

    public Board setupNewGame(){

        Board board = new Board(pieces);

        for(int i = 1; i < 8; i++){
            for(int j = 1; j < 8; j++){
                if(pieces[i-1][j-1]==null){
                    board.add(new Checker(CheckerType.EMPTY, j-1, i-1), i, j);
                }
            }
        }

        for(int i = 2; i <= 8; i=i+2){
            board.add(new Checker(CheckerType.RED_REGULAR, i-1, 0), 1, i);
        }
        for(int i = 1; i <= 7; i=i+2){
            board.add(new Checker(CheckerType.RED_REGULAR, i-1, 1), 2, i);
        }
        for(int i = 2; i <= 8; i=i+2){
            board.add(new Checker(CheckerType.RED_REGULAR, i-1, 2), 3, i);
        }

        for(int i = 1; i <= 7; i=i+2){
            board.add(new Checker(CheckerType.BLACK_REGULAR, i-1, 5), 6, i);
        }
        for(int i = 2; i <= 8; i=i+2){
            board.add(new Checker(CheckerType.BLACK_REGULAR, i-1, 6), 7, i);
        }
        for(int i = 1; i <= 7; i=i+2){
            board.add(new Checker(CheckerType.BLACK_REGULAR, i-1, 7), 8, i);
        }

        return board;
    }

    private Checker[][] setupPiecesArray(){

        Checker[][] myPieces = new Checker[ROWS][COLUMNS];

        for(int i = 0; i < ROWS; i++){
            for(int j = 0; j < COLUMNS; j++){
                myPieces[i][j]=null;
            }
        }

        //white pieces
        for(int i=0;i<3;i+=2)
            for(int j=1;j<8;j+=2)
                myPieces[i][j]= new Checker(CheckerType.RED_REGULAR, i, j);
        for(int k=0;k<8;k+=2)
            myPieces[1][k]=new Checker(CheckerType.RED_REGULAR, 1, k);
        //black pieces
        for(int l=7;l>4;l-=2)
            for(int m=0;m<8;m+=2)
                myPieces[l][m]=new Checker(CheckerType.BLACK_REGULAR, l, m);
        for(int n=1;n<8;n+=2)
            myPieces[6][n]=new Checker(CheckerType.BLACK_REGULAR, 6, n);

        return myPieces;
    }

    public static void main(String[] args)
    {
        Runnable r = new Runnable()
        {
            @Override
            public void run()
            {
                new Checkers("Checkers");
            }
        };
        EventQueue.invokeLater(r);
    }
}