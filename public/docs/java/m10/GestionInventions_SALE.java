import java.util.ArrayList;
import java.util.Scanner;

/**
 * CODEQUEST M10 — Standards
 * CE CODE EST "SALE" — Il fonctionne mais viole les conventions Java.
 * 
 * CONSIGNES :
 * 1. Identifier TOUTES les violations de standards
 * 2. Reecrire le code en respectant les conventions Java
 * 3. Ajouter la Javadoc sur les classes et methodes publiques
 * 4. Appliquer Ctrl+Shift+F pour le formatage
 */

// VIOLATION : nom de classe en minuscule
public class gestionInventions {
    // VIOLATION : attributs publics avec noms a 1 lettre
    public ArrayList<String> L;
    public int c;

    // VIOLATION : pas de Javadoc, constructeur mal nomme
    public gestionInventions(){L=new ArrayList<>();c=0;}

    // VIOLATION : nom de methode en PascalCase + underscore
    public void Add_Invention(String N){
        // VIOLATION : pas d'espaces, pas d'indentation
        if(N!=null&&N.length()>0){L.add(N);c++;System.out.println("ok");}
    }

    // VIOLATION : nombre magique, nom cryptique
    public double calc(double p) {
        return p * 1.077; // TVA suisse mais c'est quoi 1.077 ???
    }

    // VIOLATION : methode trop longue, fait tout dans une seule methode
    public void ShowAll_AND_Search(String s) {
        System.out.println("tout:");
        for(int i=0;i<L.size();i++){System.out.println(L.get(i));}
        System.out.println("recherche:");
        for(int i=0;i<L.size();i++){
            if(L.get(i).contains(s)){System.out.println("trouve: "+L.get(i));}
        }
    }

    // VIOLATION : code commente laisse en place
    // public void ancienneMethode() {
    //     for (int i = 0; i < 100; i++) {
    //         System.out.println(i);
    //     }
    // }

    public static void main(String[] args) {
        // VIOLATION : variable a 1 lettre
        gestionInventions g = new gestionInventions();
        g.Add_Invention("telephone");
        g.Add_Invention("ampoule");
        g.ShowAll_AND_Search("tel");
        System.out.println(g.calc(100));
    }
}
