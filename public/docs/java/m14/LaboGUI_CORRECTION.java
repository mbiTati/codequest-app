import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;

/**
 * CODEQUEST M14 — Swing & Events — CORRECTION
 * Panneau de controle du Labo avec CRUD graphique.
 * 
 * @author CodeQuest
 */
public class LaboGUI_CORRECTION extends JFrame {

    private ArrayList<String> inventions;
    private DefaultListModel<String> listModel;
    private JList<String> jListe;
    private JTextField champNom;
    private JLabel lblCompteur;

    public LaboGUI_CORRECTION() {
        inventions = new ArrayList<>();

        setTitle("Labo des Inventions — CodeQuest");
        setSize(500, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        // Panel Nord : saisie
        JPanel panelNord = new JPanel(new FlowLayout());
        panelNord.add(new JLabel("Invention :"));
        champNom = new JTextField(20);
        panelNord.add(champNom);
        JButton btnAjouter = new JButton("Ajouter");
        panelNord.add(btnAjouter);

        // Centre : liste
        listModel = new DefaultListModel<>();
        jListe = new JList<>(listModel);
        JScrollPane scrollPane = new JScrollPane(jListe);

        // Panel Sud : actions
        JPanel panelSud = new JPanel(new FlowLayout());
        JButton btnSupprimer = new JButton("Supprimer");
        JButton btnRechercher = new JButton("Rechercher");
        JButton btnTout = new JButton("Tout afficher");
        lblCompteur = new JLabel("Total : 0");
        panelSud.add(btnSupprimer);
        panelSud.add(btnRechercher);
        panelSud.add(btnTout);
        panelSud.add(Box.createHorizontalStrut(20));
        panelSud.add(lblCompteur);

        // === LISTENERS ===

        // Ajouter une invention
        btnAjouter.addActionListener(e -> {
            String nom = champNom.getText().trim();
            if (!nom.isEmpty()) {
                inventions.add(nom);
                listModel.addElement(nom);
                champNom.setText("");
                champNom.requestFocus();
                majCompteur();
            } else {
                JOptionPane.showMessageDialog(this, 
                    "Veuillez entrer un nom.", "Champ vide", 
                    JOptionPane.WARNING_MESSAGE);
            }
        });

        // Aussi reagir a Enter dans le champ texte
        champNom.addActionListener(e -> btnAjouter.doClick());

        // Supprimer l'invention selectionnee
        btnSupprimer.addActionListener(e -> {
            int idx = jListe.getSelectedIndex();
            if (idx >= 0) {
                inventions.remove(idx);
                listModel.remove(idx);
                majCompteur();
            } else {
                JOptionPane.showMessageDialog(this, 
                    "Selectionnez une invention a supprimer.", 
                    "Rien selectionne", JOptionPane.WARNING_MESSAGE);
            }
        });

        // Rechercher (filtre la liste)
        btnRechercher.addActionListener(e -> {
            String motCle = champNom.getText().trim().toLowerCase();
            if (motCle.isEmpty()) return;
            listModel.clear();
            for (String inv : inventions) {
                if (inv.toLowerCase().contains(motCle)) {
                    listModel.addElement(inv);
                }
            }
        });

        // Tout afficher (reset du filtre)
        btnTout.addActionListener(e -> {
            listModel.clear();
            for (String inv : inventions) {
                listModel.addElement(inv);
            }
        });

        // Assemblage
        add(panelNord, BorderLayout.NORTH);
        add(scrollPane, BorderLayout.CENTER);
        add(panelSud, BorderLayout.SOUTH);

        setVisible(true);
    }

    private void majCompteur() {
        lblCompteur.setText("Total : " + inventions.size());
    }

    public static void main(String[] args) {
        new LaboGUI_CORRECTION();
    }
}
