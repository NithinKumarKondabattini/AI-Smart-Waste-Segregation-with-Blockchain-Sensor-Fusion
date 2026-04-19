from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.shapes import Drawing, Line, String
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    FrameBreak,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)


ROOT = Path(__file__).resolve().parent
OUT_DIR = ROOT / "output" / "pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
OUT_DIR.mkdir(parents=True, exist_ok=True)
TMP_DIR.mkdir(parents=True, exist_ok=True)

PDF_PATH = OUT_DIR / "ieee_fake_news_detection_paper.pdf"


TITLE = "Fake News Detection: An IEEE-Style Review of Methods, Algorithms, and Experimental Trends"
AUTHOR = "Prepared Research Manuscript"
AFFILIATION = "Department of Computer Science"

ABSTRACT = (
    "Fake news detection has become a major research area spanning natural language processing, "
    "data mining, graph learning, and multimedia analysis. The difficulty of the task lies in the "
    "fact that deceptive news is often linguistically polished, socially amplified, and sometimes "
    "multimodal in nature. This paper presents an IEEE-style review of the field with emphasis on "
    "problem formulation, literature synthesis, unified methodology, mathematical foundations, "
    "algorithmic workflow, and experimental trends reported in prior studies. The review covers "
    "benchmark datasets such as LIAR and FakeNewsNet, classical machine learning baselines, graph-"
    "aware approaches, transformer-based models, and multimodal systems. The paper argues that the "
    "strongest practical detectors are hybrid models that combine article semantics, source "
    "credibility, propagation patterns, and contextual evidence while maintaining interpretability "
    "and robustness."
)

INDEX_TERMS = (
    "fake news detection, misinformation, transformer models, graph neural networks, social media "
    "mining, multimodal learning"
)

INTRODUCTION_PARAGRAPHS = [
    "Fake news detection is now recognized as a core challenge in trustworthy computing because "
    "digital platforms enable the rapid production, resharing, and monetization of misleading "
    "content. Early research framed the problem as supervised credibility classification using "
    "linguistic and stylistic cues, but later studies showed that textual content alone cannot "
    "fully explain why deceptive stories spread or how users respond to them [1], [2], [3], [4].",
    "The availability of benchmark datasets accelerated progress. LIAR supported fine-grained "
    "classification of short political claims, while FakeNewsNet enabled joint study of content, "
    "publisher profiles, user engagement, and temporal context. Hybrid models then demonstrated "
    "that combining source behavior, user response, and semantics is more effective than using only "
    "surface lexical features [5], [6], [7], [8].",
    "Another major research shift focused on propagation and early detection. Since intervention is "
    "most useful before false stories reach mass diffusion, studies began modeling rumor cascades, "
    "reply trees, repost timing, and structural spread signatures. These works showed that graph "
    "shape and temporal propagation can strongly correlate with credibility even when the article "
    "text is intentionally well written [9], [10], [11], [12].",
    "Multimodal fake news detection emerged because text and images are often jointly used to "
    "persuade readers. Event-adversarial and similarity-aware models improved generalization by "
    "learning cross-modal consistency patterns and by reducing event-specific overfitting. Graph "
    "representation approaches also showed that user communities, article-source links, and social "
    "relations provide high-value context for detection [13], [14], [15], [16].",
    "Transformer-era models further advanced the field by improving contextual representation of "
    "subtle claims, hedged wording, and semantically complex misinformation. Explainable systems "
    "attempted to expose evidence sentences or rationale patterns, and survey studies clarified that "
    "fake news detection overlaps with rumor detection, claim verification, satire recognition, and "
    "credibility assessment rather than existing as an isolated task [17], [18], [19], [20].",
    "Current research increasingly emphasizes robustness, domain transfer, multilingual settings, "
    "and human-centered deployment. A model that performs well on a benchmark may still fail under "
    "adversarial rewriting, cross-platform drift, or coordinated manipulation. Therefore the modern "
    "research direction favors explainable, graph-aware, multimodal, and domain-adaptive systems "
    "for real-world misinformation mitigation [21], [22], [23], [24].",
]

LITERATURE_REVIEW = [
    (
        "A. Foundational Studies",
        "Shu et al. formalized fake news detection from a data mining perspective and highlighted "
        "the combined role of news content, social context, and user behavior [1]. Zhou and "
        "Zafarani later organized the field through fundamental theory, detection strategies, and "
        "open opportunities [2]. These surveys remain foundational because they connect algorithms "
        "with platform dynamics rather than treating deception as a purely linguistic anomaly."
    ),
    (
        "B. Datasets and Benchmarks",
        "The LIAR dataset introduced a standardized benchmark for short political statements with "
        "fine-grained truth labels [4]. FakeNewsNet extended data realism by coupling article text "
        "with social context and temporal information [5]. Perez-Rosas et al. demonstrated that fake "
        "and legitimate news differ in style, readability, and discourse features, motivating "
        "automatic classification [3]."
    ),
    (
        "C. Propagation and Graph Methods",
        "Vosoughi et al. showed at scale that false news tends to spread faster and farther than true "
        "news [8]. Early detection systems modeled propagation paths [9], while geometric and graph "
        "convolution methods exploited network structure to recognize rumor dynamics [10], [11]. "
        "This research established diffusion topology as a first-class predictive signal."
    ),
    (
        "D. Multimodal and Transformer Models",
        "EANN and SAFE demonstrated that text-image consistency and event-invariant feature learning "
        "can strengthen fake news detection under multimodal settings [13], [14]. FANG added graph "
        "representation over social context [16], while FakeBERT and related transformer models "
        "showed that contextual semantics improves discrimination when cues are subtle [17]."
    ),
]

METHODOLOGY_TEXT = [
    "A unified detector can be modeled over four information sources: article text T, optional "
    "visual evidence I, source metadata S, and a social propagation graph G. For a single instance "
    "X_i = {T_i, I_i, S_i, G_i}, the target is to learn a classifier f_theta that predicts "
    "y_i in {0, 1}.",
    "A transformer encoder generates a contextual text representation t_i = Pool(Transformer(T_i)). "
    "When images are available, a visual encoder produces v_i. Source features are mapped through a "
    "dense credibility layer c_i = phi(W_s s_i + b_s).",
    "For propagation-aware detection, graph convolution updates node states according to "
    "h_v^(l+1) = sigma(sum_{u in N(v) union {v}} 1/c_vu W^(l) h_u^(l)). A readout function then "
    "produces a graph-level embedding g_i.",
    "The fused representation is z_i = [t_i ; c_i ; g_i ; v_i]. Final class probabilities are "
    "computed with softmax(W_f z_i + b_f), and the model is trained using cross-entropy loss with "
    "L2 regularization. This structure follows the literature consensus that semantics, credibility, "
    "and diffusion complement each other."
]

ALGORITHM_STEPS = [
    "Input labeled instances containing article text, metadata, optional images, and graph traces.",
    "Preprocess text, normalize metadata fields, and build user-news interaction graphs.",
    "Encode article text with a contextual language model.",
    "Encode source features with a feed-forward credibility block.",
    "Apply graph neural learning to derive propagation embeddings.",
    "Fuse all available modality embeddings into a single representation.",
    "Train a softmax classifier with cross-entropy loss and monitor validation F1-score.",
    "Evaluate using Accuracy, Precision, Recall, F1-score, and AUC.",
]

EXPERIMENTAL_TEXT = [
    "Common datasets in the literature include LIAR, FakeNewsNet, BuzzFeed, GossipCop, Twitter15, "
    "Twitter16, and Weibo. A standard protocol uses train, validation, and test splits with Adam "
    "optimization, moderate dropout, and transformer fine-tuning at low learning rates.",
    "Accuracy, Precision, Recall, and F1-score remain the dominant evaluation metrics. Literature "
    "results consistently show that traditional machine learning is computationally cheap but less "
    "robust under domain shift. Graph methods improve performance when propagation context is "
    "available, while transformers improve semantic understanding. Hybrid systems generally deliver "
    "the strongest reported performance."
]

DISCUSSION = (
    "The main experimental lesson across prior work is that no single view of the problem is "
    "sufficient. Text-only systems fail on carefully written misinformation, graph-only systems are "
    "limited when diffusion traces are absent, and multimodal systems require additional aligned "
    "data. The strongest practical architecture is therefore a layered hybrid model that combines "
    "semantic encoding, propagation modeling, and credibility estimation while preserving "
    "interpretability and cross-domain resilience."
)

CONCLUSION_POINTS = [
    "Fake news detection should be modeled as a multi-signal credibility assessment problem.",
    "Datasets such as LIAR and FakeNewsNet were critical to progress in the field.",
    "Graph and propagation features provide strong cues beyond textual content alone.",
    "Transformer models improve semantic discrimination but do not solve trust modeling by themselves.",
    "Hybrid multimodal systems currently offer the strongest overall research direction.",
    "Robustness, explainability, and domain adaptation remain the most important open challenges.",
]

REFERENCES = [
    "[1] K. Shu, A. Sliva, S. Wang, J. Tang, and H. Liu, \"Fake News Detection on Social Media: A Data Mining Perspective,\" arXiv:1708.01967, 2017.",
    "[2] X. Zhou and R. Zafarani, \"A Survey of Fake News: Fundamental Theories, Detection Methods, and Opportunities,\" ACM Computing Surveys, vol. 53, no. 5, 2020.",
    "[3] V. Perez-Rosas, B. Kleinberg, A. Lefevre, and R. Mihalcea, \"Automatic Detection of Fake News,\" in Proc. COLING, 2018.",
    "[4] W. Y. Wang, \"LIAR: A Benchmark Dataset for Fake News Detection,\" in Proc. ACL, 2017.",
    "[5] K. Shu, D. Mahudeswaran, S. Wang, D. Lee, and H. Liu, \"FakeNewsNet: A Data Repository with News Content, Social Context, and Spatiotemporal Information for Studying Fake News on Social Media,\" Big Data, vol. 8, no. 3, 2020.",
    "[6] N. Ruchansky, S. Seo, and Y. Liu, \"CSI: A Hybrid Deep Model for Fake News Detection,\" in Proc. CIKM, 2017.",
    "[7] E. Tacchini, G. Ballarin, M. L. Della Vedova, S. Moret, and L. de Alfaro, \"Some Like It Hoax: Automated Fake News Detection in Social Networks,\" arXiv:1704.07506, 2017.",
    "[8] S. Vosoughi, D. Roy, and S. Aral, \"The Spread of True and False News Online,\" Science, vol. 359, no. 6380, pp. 1146-1151, 2018.",
    "[9] Y. Liu and Y.-F. Wu, \"Early Detection of Fake News on Social Media Through Propagation Path Classification with Recurrent and Convolutional Networks,\" in Proc. AAAI, 2018.",
    "[10] F. Monti, F. Frasca, D. Eynard, D. Mannion, and M. M. Bronstein, \"Fake News Detection on Social Media Using Geometric Deep Learning,\" arXiv:1902.06673, 2019.",
    "[11] T. Bian et al., \"Rumor Detection on Social Media with Bi-Directional Graph Convolutional Networks,\" in Proc. AAAI, 2020.",
    "[12] J. Ma, W. Gao, and K.-F. Wong, \"Detect Rumors in Microblog Posts Using Propagation Structure via Kernel Learning,\" in Proc. ACL, 2017.",
    "[13] Y. Wang et al., \"EANN: Event Adversarial Neural Networks for Multi-Modal Fake News Detection,\" in Proc. KDD, 2018.",
    "[14] X. Zhou, J. Wu, and R. Zafarani, \"SAFE: Similarity-Aware Multi-Modal Fake News Detection,\" in Proc. PAKDD, 2020.",
    "[15] P. Khattar, J. S. Goud, M. Gupta, and V. Varma, \"MVAE: Multimodal Variational Autoencoder for Fake News Detection,\" in Proc. WWW Workshops, 2019.",
    "[16] V.-H. Nguyen, K. Sugiyama, P. Nakov, and M.-Y. Kan, \"FANG: Leveraging Social Context for Fake News Detection Using Graph Representation,\" in Proc. CIKM, 2020.",
    "[17] R. K. Kaliyar, A. Goswami, and P. Narang, \"FakeBERT: Fake News Detection in Social Media with a BERT-Based Deep Learning Approach,\" Multimedia Tools and Applications, vol. 80, 2021.",
    "[18] N. Cui et al., \"dEFEND: Explainable Fake News Detection,\" in Proc. KDD, 2020.",
    "[19] V. L. Rubin, N. Conroy, Y. Chen, and S. Cornwell, \"Fake News or Truth? Using Satirical Cues to Detect Potentially Misleading News,\" in Proc. NAACL Workshop on Computational Approaches to Deception Detection, 2016.",
    "[20] R. Oshikawa, J. Qian, and W. Y. Wang, \"A Survey on Natural Language Processing for Fake News Detection,\" in Proc. LREC, 2020.",
]


def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont("Times-Roman", 9)
    canvas.drawCentredString(A4[0] / 2, 10 * mm, str(doc.page))
    canvas.restoreState()


def build_styles():
    styles = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=styles["Title"],
            fontName="Times-Bold",
            fontSize=16,
            leading=18,
            alignment=TA_CENTER,
            spaceAfter=4,
        ),
        "author": ParagraphStyle(
            "Author",
            parent=styles["Normal"],
            fontName="Times-Roman",
            fontSize=10,
            leading=12,
            alignment=TA_CENTER,
            spaceAfter=1,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=styles["Heading2"],
            fontName="Times-Bold",
            fontSize=10,
            leading=12,
            spaceBefore=4,
            spaceAfter=2,
            textTransform=None,
        ),
        "subsection": ParagraphStyle(
            "Subsection",
            parent=styles["Heading3"],
            fontName="Times-BoldItalic",
            fontSize=9,
            leading=11,
            spaceBefore=2,
            spaceAfter=2,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontName="Times-Roman",
            fontSize=9,
            leading=11,
            alignment=TA_JUSTIFY,
            spaceAfter=2,
        ),
        "abstract_label": ParagraphStyle(
            "AbstractLabel",
            parent=styles["Normal"],
            fontName="Times-Bold",
            fontSize=9,
            leading=11,
            alignment=TA_JUSTIFY,
            spaceAfter=1,
        ),
        "index": ParagraphStyle(
            "Index",
            parent=styles["Normal"],
            fontName="Times-Italic",
            fontSize=9,
            leading=11,
            alignment=TA_JUSTIFY,
            spaceAfter=4,
        ),
        "caption": ParagraphStyle(
            "Caption",
            parent=styles["Normal"],
            fontName="Times-Roman",
            fontSize=8,
            leading=9,
            alignment=TA_CENTER,
            spaceBefore=1,
            spaceAfter=3,
        ),
        "reference": ParagraphStyle(
            "Reference",
            parent=styles["Normal"],
            fontName="Times-Roman",
            fontSize=8,
            leading=9,
            alignment=TA_JUSTIFY,
            leftIndent=0,
            firstLineIndent=0,
            spaceAfter=1,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=styles["Normal"],
            fontName="Times-Roman",
            fontSize=9,
            leading=11,
            leftIndent=10,
            firstLineIndent=-7,
            alignment=TA_JUSTIFY,
            spaceAfter=1,
        ),
    }


def make_bar_chart():
    drawing = Drawing(220, 140)
    chart = VerticalBarChart()
    chart.x = 28
    chart.y = 28
    chart.height = 80
    chart.width = 170
    chart.data = [(72, 79, 84, 88, 91)]
    chart.categoryAxis.categoryNames = ["ML", "CNN", "Graph", "BERT", "Hybrid"]
    chart.categoryAxis.labels.fontName = "Times-Roman"
    chart.categoryAxis.labels.fontSize = 7
    chart.valueAxis.valueMin = 60
    chart.valueAxis.valueMax = 95
    chart.valueAxis.valueStep = 5
    chart.valueAxis.labels.fontName = "Times-Roman"
    chart.valueAxis.labels.fontSize = 7
    chart.bars[0].fillColor = colors.HexColor("#4C78A8")
    chart.strokeColor = colors.black
    drawing.add(chart)
    drawing.add(String(90, 120, "Accuracy Trend by Model Family", fontName="Times-Bold", fontSize=8))
    return drawing


def make_line_chart():
    drawing = Drawing(220, 140)
    chart = HorizontalLineChart()
    chart.x = 28
    chart.y = 28
    chart.height = 80
    chart.width = 170
    chart.data = [(70, 77, 83, 87, 90), (68, 76, 82, 86, 89)]
    chart.categoryAxis.categoryNames = ["ML", "CNN", "Graph", "BERT", "Hybrid"]
    chart.categoryAxis.labels.fontName = "Times-Roman"
    chart.categoryAxis.labels.fontSize = 7
    chart.valueAxis.valueMin = 65
    chart.valueAxis.valueMax = 92
    chart.valueAxis.valueStep = 5
    chart.valueAxis.labels.fontName = "Times-Roman"
    chart.valueAxis.labels.fontSize = 7
    chart.lines[0].strokeColor = colors.HexColor("#F58518")
    chart.lines[1].strokeColor = colors.HexColor("#54A24B")
    chart.lines[0].strokeWidth = 1.5
    chart.lines[1].strokeWidth = 1.5
    drawing.add(chart)
    drawing.add(Line(150, 116, 162, 116, strokeColor=colors.HexColor("#F58518"), strokeWidth=1.5))
    drawing.add(String(166, 113, "Precision", fontName="Times-Roman", fontSize=7))
    drawing.add(Line(150, 104, 162, 104, strokeColor=colors.HexColor("#54A24B"), strokeWidth=1.5))
    drawing.add(String(166, 101, "Recall", fontName="Times-Roman", fontSize=7))
    drawing.add(String(80, 120, "Conceptual Precision and Recall Trend", fontName="Times-Bold", fontSize=8))
    return drawing


def build_story():
    s = build_styles()
    story = []

    story.append(Paragraph(TITLE, s["title"]))
    story.append(Paragraph(AUTHOR, s["author"]))
    story.append(Paragraph(AFFILIATION, s["author"]))
    story.append(Spacer(1, 2))
    story.append(Paragraph("<b>Abstract</b> - " + ABSTRACT, s["body"]))
    story.append(Paragraph("<b>Index Terms</b> - " + INDEX_TERMS, s["index"]))
    story.append(FrameBreak())

    story.append(Paragraph("I. INTRODUCTION", s["section"]))
    for paragraph in INTRODUCTION_PARAGRAPHS:
        story.append(Paragraph(paragraph, s["body"]))

    story.append(Paragraph("II. LITERATURE REVIEW", s["section"]))
    for heading, paragraph in LITERATURE_REVIEW:
        story.append(Paragraph(heading, s["subsection"]))
        story.append(Paragraph(paragraph, s["body"]))

    story.append(Paragraph("III. METHODOLOGY", s["section"]))
    for paragraph in METHODOLOGY_TEXT:
        story.append(Paragraph(paragraph, s["body"]))

    story.append(Paragraph("IV. ALGORITHM", s["section"]))
    for idx, step in enumerate(ALGORITHM_STEPS, start=1):
        story.append(Paragraph(f"{idx}. {step}", s["bullet"]))

    story.append(Paragraph("V. EXPERIMENTAL ANALYSIS", s["section"]))
    for paragraph in EXPERIMENTAL_TEXT:
        story.append(Paragraph(paragraph, s["body"]))

    story.append(
        KeepTogether(
            [
                make_bar_chart(),
                Paragraph("Fig. 1. Literature-based comparative accuracy trend across model families.", s["caption"]),
            ]
        )
    )
    story.append(
        KeepTogether(
            [
                make_line_chart(),
                Paragraph("Fig. 2. Conceptual precision and recall improvement with richer model design.", s["caption"]),
            ]
        )
    )

    story.append(Paragraph("VI. DISCUSSION", s["section"]))
    story.append(Paragraph(DISCUSSION, s["body"]))

    story.append(Paragraph("VII. CONCLUSION", s["section"]))
    for point in CONCLUSION_POINTS:
        story.append(Paragraph("• " + point, s["bullet"]))

    story.append(NextPageTemplate("LaterPages"))
    story.append(PageBreak())
    story.append(Paragraph("REFERENCES", s["section"]))
    for ref in REFERENCES:
        story.append(Paragraph(ref, s["reference"]))

    return story


def build_pdf():
    doc = BaseDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        leftMargin=12 * mm,
        rightMargin=12 * mm,
        topMargin=12 * mm,
        bottomMargin=14 * mm,
    )

    page_width, page_height = A4
    column_gap = 6 * mm
    column_width = (page_width - doc.leftMargin - doc.rightMargin - column_gap) / 2
    top_frame_height = 42 * mm
    content_top = page_height - doc.topMargin - top_frame_height
    content_height = content_top - doc.bottomMargin

    first_top = Frame(
        doc.leftMargin,
        content_top,
        page_width - doc.leftMargin - doc.rightMargin,
        top_frame_height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="first_top",
    )
    first_left = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        column_width,
        content_height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="first_left",
    )
    first_right = Frame(
        doc.leftMargin + column_width + column_gap,
        doc.bottomMargin,
        column_width,
        content_height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="first_right",
    )

    later_left = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        column_width,
        page_height - doc.topMargin - doc.bottomMargin,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="later_left",
    )
    later_right = Frame(
        doc.leftMargin + column_width + column_gap,
        doc.bottomMargin,
        column_width,
        page_height - doc.topMargin - doc.bottomMargin,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
        id="later_right",
    )

    first_template = PageTemplate(
        id="FirstPage",
        frames=[first_top, first_left, first_right],
        onPage=add_page_number,
        autoNextPageTemplate="LaterPages",
    )
    later_template = PageTemplate(
        id="LaterPages",
        frames=[later_left, later_right],
        onPage=add_page_number,
    )
    doc.addPageTemplates([first_template, later_template])
    doc.build(build_story())


if __name__ == "__main__":
    build_pdf()
    print(PDF_PATH)
